import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const type = searchParams.get('type')

  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const radius = searchParams.get('radius')

  try {
    if (lat && lng) {
      const latitude = parseFloat(lat)
      const longitude = parseFloat(lng)
      const r = radius ? parseFloat(radius) : 5

      const properties = await prisma.$queryRaw`
        SELECT p.*, 
               u.name as "landlordName", 
               u.email as "landlordEmail",
               (SELECT json_agg(pi.*) FROM "PropertyImage" pi WHERE pi."propertyId" = p.id) as images
        FROM "Property" p
        JOIN "User" u ON p."landlordId" = u.id
        WHERE (6371 * acos(cos(radians(${latitude})) * cos(radians(p.latitude)) * cos(radians(p.longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(p.latitude)))) <= ${r}
        ORDER BY "createdAt" DESC
      `

      const formattedProperties = (properties as any[]).map(p => ({
        ...p,
        landlord: { name: p.landlordName, email: p.landlordEmail }
      }))

      return NextResponse.json(formattedProperties)
    }

    const where: any = {}
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { address: { contains: q, mode: 'insensitive' } },
      ]
    }
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }
    if (type) {
      where.type = type
    }

    const properties = await prisma.property.findMany({
      where,
      include: { images: true, landlord: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(properties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
