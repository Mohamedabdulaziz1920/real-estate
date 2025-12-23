import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const maxDistance = parseFloat(searchParams.get('distance') || '10'); // km
    const limit = parseInt(searchParams.get('limit') || '10');
    const excludeId = searchParams.get('exclude');

    if (!lat || !lng) {
      return NextResponse.json(
        { success: false, message: 'الإحداثيات مطلوبة' },
        { status: 400 }
      );
    }

    // البحث بالإحداثيات باستخدام MongoDB
    const properties = await Property.find({
      status: 'available',
      'location.coordinates': {
        $geoWithin: {
          $centerSphere: [[lng, lat], maxDistance / 6378.1], // Convert km to radians
        },
      },
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
      .limit(limit)
      .select('titleAr price listingType propertyType images location features');

    return NextResponse.json({
      success: true,
      data: properties,
    });
  } catch (error: any) {
    console.error('Nearby properties error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ' },
      { status: 500 }
    );
  }
}