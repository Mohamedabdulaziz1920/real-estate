import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import User from '@/models/User';

// ⭐ أضف هذا السطر ⭐
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 403 }
      );
    }

    await dbConnect();

    // إحصائيات العقارات
    const totalProperties = await Property.countDocuments();
    const activeProperties = await Property.countDocuments({ status: 'available' });
    const soldProperties = await Property.countDocuments({ status: 'sold' });
    const rentedProperties = await Property.countDocuments({ status: 'rented' });
    const pendingProperties = await Property.countDocuments({ status: 'pending' });
    const draftProperties = await Property.countDocuments({ status: 'draft' });
    const featuredProperties = await Property.countDocuments({ featured: true });

    // إحصائيات المستخدمين
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const agents = await User.countDocuments({ role: 'agent' });
    const admins = await User.countDocuments({ role: 'admin' });

    // إحصائيات المشاهدات
    const viewsResult = await Property.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    const totalViews = viewsResult[0]?.totalViews || 0;

    // إحصائيات الأسعار
    const priceStats = await Property.aggregate([
      { $match: { status: 'available' } },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        }
      }
    ]);

    // العقارات حسب النوع
    const propertiesByType = await Property.aggregate([
      { $group: { _id: '$propertyType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // العقارات حسب المدينة
    const propertiesByCity = await Property.aggregate([
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // العقارات حسب الشهر (آخر 12 شهر)
    const propertiesByMonth = await Property.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // المستخدمين الجدد (آخر 30 يوم)
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    // أحدث العقارات
    const recentProperties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('owner', 'name email')
      .select('titleAr price status propertyType location images createdAt');

    // أحدث المستخدمين
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role image createdAt');

    // العقارات الأكثر مشاهدة
    const topViewedProperties = await Property.find()
      .sort({ views: -1 })
      .limit(5)
      .select('titleAr views price location images');

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalProperties,
          activeProperties,
          soldProperties,
          rentedProperties,
          pendingProperties,
          draftProperties,
          featuredProperties,
          totalUsers,
          activeUsers,
          agents,
          admins,
          totalViews,
          newUsersThisMonth,
        },
        priceStats: priceStats[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0 },
        propertiesByType,
        propertiesByCity,
        propertiesByMonth,
        recentProperties,
        recentUsers,
        topViewedProperties,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ' },
      { status: 500 }
    );
  }
}
