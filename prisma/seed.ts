import { PrismaClient, Role, PropertyType, PropertyStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.propertyImage.deleteMany()
  await prisma.property.deleteMany()
  await prisma.user.deleteMany()

  const landlord = await prisma.user.create({
    data: {
      email: 'landlord@example.com',
      password: 'hashed_password',
      name: 'Nguyễn Văn A',
      role: Role.LANDLORD,
    },
  })

  const realStreets = [
    { name: 'Nguyễn Văn Linh', district: 'Hải Châu' },
    { name: 'Phan Châu Trinh', district: 'Hải Châu' },
    { name: 'Lê Duẩn', district: 'Hải Châu' },
    { name: 'Bạch Đằng', district: 'Hải Châu' },
    { name: 'Hùng Vương', district: 'Thanh Khê' },
    { name: 'Điện Biên Phủ', district: 'Thanh Khê' },
    { name: 'Hàm Nghi', district: 'Thanh Khê' },
    { name: 'Võ Nguyên Giáp', district: 'Sơn Trà' },
    { name: 'Phạm Văn Đồng', district: 'Sơn Trà' },
    { name: 'Hồ Nghinh', district: 'Sơn Trà' },
    { name: 'Trần Hưng Đạo', district: 'Sơn Trà' },
    { name: 'Phan Tứ', district: 'Ngũ Hành Sơn' },
    { name: 'An Thượng 10', district: 'Ngũ Hành Sơn' },
    { name: 'Lê Văn Hiến', district: 'Ngũ Hành Sơn' },
    { name: 'Võ Chí Công', district: 'Cẩm Lệ' },
    { name: 'Nguyễn Phước Lan', district: 'Cẩm Lệ' },
    { name: 'Cách Mạng Tháng 8', district: 'Cẩm Lệ' },
    { name: 'Tôn Đức Thắng', district: 'Liên Chiểu' },
    { name: 'Âu Cơ', district: 'Liên Chiểu' },
    { name: 'Nguyễn Lương Bằng', district: 'Liên Chiểu' },
  ]

  const properties = [
    // 10 Phòng đầu tiên có thông tin chi tiết cụ thể
    {
      title: 'Căn hộ Studio cao cấp Hải Châu',
      description: 'Nội thất sang trọng, trung tâm gần cầu Rồng, view sông Hàn thoáng mát.',
      address: '150 Đống Đa, p. Thuận Phước, Hải Châu, Đà Nẵng',
      price: 5500000,
      type: PropertyType.ROOM,
      status: PropertyStatus.AVAILABLE,
      latitude: 16.0792,
      longitude: 108.2163,
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000']
    },
    {
      title: 'Phòng trọ sinh viên gần cầu Rồng',
      description: 'Phòng sạch sẽ, an ninh, giờ giấc tự do, gần chợ và cửa hàng tiện lợi.',
      address: '88 Nguyễn Văn Linh, p. Nam Dương, Hải Châu, Đà Nẵng',
      price: 2800000,
      type: PropertyType.ROOM,
      status: PropertyStatus.AVAILABLE,
      latitude: 16.0610,
      longitude: 108.2150,
      images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1000']
    },
    {
      title: 'Nhà nguyên căn kiệt Điện Biên Phủ',
      description: 'Nhà 2 tầng, 3 phòng ngủ, sân rộng rãi, phù hợp cho gia đình hoặc kinh doanh nhỏ.',
      address: 'Kiệt 390 Điện Biên Phủ, p. Hòa Khê, Thanh Khê, Đà Nẵng',
      price: 8000000,
      type: PropertyType.HOUSE,
      status: PropertyStatus.AVAILABLE,
      latitude: 16.0620,
      longitude: 108.1820,
      images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1000', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1000']
    },
    {
      title: 'Căn hộ view biển Sơn Trà',
      description: 'Căn hộ cao cấp sát biển, nội thất gỗ tự nhiên, ban công nhìn thẳng ra biển Mân Thái.',
      address: 'Trần Quang Khải, p. Mân Thái, Sơn Trà, Đà Nẵng',
      price: 7500000,
      type: PropertyType.ROOM,
      status: PropertyStatus.AVAILABLE,
      latitude: 16.0950,
      longitude: 108.2480,
      images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1000', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000']
    },
    // Tạo thêm 26 phòng còn lại bằng dữ liệu thật ngẫu nhiên
    ...(Array.from({ length: 26 }).map((_, i) => {
      const street = realStreets[Math.floor(Math.random() * realStreets.length)]
      const houseNum = Math.floor(Math.random() * 500) + 1
      const price = 1500000 + (Math.random() * 7000000)
      
      return {
        title: `${price > 6000000 ? 'Căn hộ cao cấp' : 'Phòng trọ hiện đại'} đường ${street.name}`,
        description: `Phòng mới sạch sẽ, khu dân cư an ninh, thuận tiện đi lại trung tâm quận ${street.district}.`,
        address: `${houseNum} ${street.name}, q. ${street.district}, Đà Nẵng`,
        price: price,
        type: price > 7000000 && Math.random() > 0.5 ? PropertyType.HOUSE : PropertyType.ROOM,
        status: PropertyStatus.AVAILABLE,
        latitude: 16.0 + (Math.random() * 0.1),
        longitude: 108.15 + (Math.random() * 0.1),
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000'
        ]
      }
    }))
  ]

  for (const p of properties) {
    const { images, ...propertyData } = p
    await prisma.property.create({
      data: {
        ...propertyData,
        landlordId: landlord.id,
        images: {
          create: images.map((url) => ({ url })),
        },
      },
    })
  }

  console.log(`Seed data created successfully with ${properties.length} real addresses!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
