import { PrismaClient, Role, PropertyType, PropertyStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Xóa dữ liệu cũ
  await prisma.propertyImage.deleteMany()
  await prisma.property.deleteMany()
  await prisma.user.deleteMany()

  // Tạo người dùng mẫu (Chủ nhà)
  const landlord = await prisma.user.create({
    data: {
      email: 'landlord@example.com',
      password: 'hashed_password',
      name: 'Nguyễn Văn A',
      role: Role.LANDLORD,
    },
  })

  // Danh sách nhà trọ mẫu phong phú hơn
  const properties = [
    {
      title: 'Phòng trọ cao cấp Hải Châu',
      description: 'Phòng đầy đủ nội thất, hiện đại, trung tâm thành phố. An ninh 24/7, có thang máy.',
      address: '150 Đống Đa, Hải Châu, Đà Nẵng',
      price: 4500000,
      type: PropertyType.ROOM,
      status: PropertyStatus.AVAILABLE,
      latitude: 16.0792,
      longitude: 108.2163,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=1000',
      ],
    },
    {
      title: 'Căn hộ view sông Hàn',
      description: 'View cực đẹp nhìn ra cầu Rồng, ban công rộng thoáng mát. Đầy đủ tiện nghi bếp, máy giặt.',
      address: '22 Trần Hưng Đạo, Sơn Trà, Đà Nẵng',
      price: 7500000,
      type: PropertyType.HOUSE,
      status: PropertyStatus.AVAILABLE,
      latitude: 16.0600,
      longitude: 108.2280,
      images: [
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000',
      ],
    },
    {
      title: 'Phòng trọ sinh viên gần ĐH Bách Khoa',
      description: 'Giá rẻ, có gác lửng, giờ giấc tự do, gần chợ đêm.',
      address: '45 Phạm Như Xương, Liên Chiểu, Đà Nẵng',
      price: 1800000,
      type: PropertyType.ROOM,
      status: PropertyStatus.AVAILABLE,
      latitude: 16.0620,
      longitude: 108.1520,
      images: [
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000',
      ],
    },
    {
      title: 'Nhà nguyên căn Hòa Xuân',
      description: 'Nhà 2 tầng mới xây, khu đô thị hiện đại, an ninh tốt, đường rộng 7.5m.',
      address: 'Võ Chí Công, Cẩm Lệ, Đà Nẵng',
      price: 9000000,
      type: PropertyType.HOUSE,
      status: PropertyStatus.AVAILABLE,
      latitude: 15.9900,
      longitude: 108.2150,
      images: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000',
      ],
    },
    {
      title: 'Phòng trọ gần cầu Rồng',
      description: 'Phòng thoáng mát, gần trung tâm, tiện đi lại. Có chỗ để xe an toàn.',
      address: '88 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
      price: 2500000,
      type: PropertyType.ROOM,
      status: PropertyStatus.AVAILABLE,
      latitude: 16.0610,
      longitude: 108.2150,
      images: [
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1000',
      ],
    },
    {
      title: 'Căn hộ Studio Mân Thái',
      description: 'Cách biển 5 phút đi bộ, nội thất gỗ sang trọng, sạch sẽ.',
      address: 'Trần Quang Khải, Sơn Trà, Đà Nẵng',
      price: 5000000,
      type: PropertyType.ROOM,
      status: PropertyStatus.AVAILABLE,
      latitude: 16.0950,
      longitude: 108.2480,
      images: [
        'https://images.unsplash.com/photo-1536376074432-8aa6d7169288?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000',
      ],
    },
    {
      title: 'Phòng trọ cao cấp Ngũ Hành Sơn',
      description: 'Gần trường ĐH Kinh Tế, đầy đủ tiện nghi, khu yên tĩnh.',
      address: '20 Phan Tứ, Ngũ Hành Sơn, Đà Nẵng',
      price: 3200000,
      type: PropertyType.ROOM,
      status: PropertyStatus.AVAILABLE,
      latitude: 16.0505,
      longitude: 108.2435,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000',
      ],
    },
    {
      title: 'Nhà nguyên căn nhỏ Thanh Khê',
      description: 'Thích hợp cho gia đình trẻ, an ninh, gần chợ hải sản.',
      address: '45 Lê Độ, Thanh Khê, Đà Nẵng',
      price: 6500000,
      type: PropertyType.HOUSE,
      status: PropertyStatus.AVAILABLE,
      latitude: 16.0680,
      longitude: 108.1950,
      images: [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1000',
      ],
    },
    {
      title: 'Phòng trọ giá rẻ Liên Chiểu',
      description: 'Gần KCN Hòa Khánh, thuận tiện cho công nhân và sinh viên.',
      address: '10 Âu Cơ, Liên Chiểu, Đà Nẵng',
      price: 1200000,
      type: PropertyType.ROOM,
      status: PropertyStatus.AVAILABLE,
      latitude: 16.0750,
      longitude: 108.1450,
      images: [
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=1000',
      ],
    },
    {
      title: 'Căn hộ chung cư cao cấp',
      description: 'Tầng cao, view biển Mỹ Khê, hồ bơi vô cực, gym.',
      address: 'Võ Nguyên Giáp, Sơn Trà, Đà Nẵng',
      price: 12000000,
      type: PropertyType.HOUSE,
      status: PropertyStatus.AVAILABLE,
      latitude: 16.0710,
      longitude: 108.2450,
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1600607687940-472002695533?auto=format&fit=crop&q=80&w=1000',
      ],
    },
    {
      title: 'Phòng trọ yên tĩnh Cẩm Lệ',
      description: 'Khu vực an ninh tốt, gần bệnh viện Tâm Trí.',
      address: '12 Cách Mạng Tháng 8, Cẩm Lệ, Đà Nẵng',
      price: 2200000,
      type: PropertyType.ROOM,
      status: PropertyStatus.AVAILABLE,
      latitude: 16.0250,
      longitude: 108.2050,
      images: [
        'https://images.unsplash.com/photo-1595521624992-48a59aef95e3?auto=format&fit=crop&q=80&w=1000',
      ],
    },
    {
      title: 'Phòng mới xây Ngũ Hành Sơn',
      description: 'Phòng cực mới, chưa ai ở, full nội thất cao cấp.',
      address: 'Lê Văn Hiến, Ngũ Hành Sơn, Đà Nẵng',
      price: 3800000,
      type: PropertyType.ROOM,
      status: PropertyStatus.AVAILABLE,
      latitude: 16.0150,
      longitude: 108.2550,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000',
      ],
    },
    {
      title: 'Nhà nguyên căn giá tốt',
      description: 'Nhà cấp 4 có sân, thích hợp nuôi thú cưng.',
      address: 'Kiệt 300 Điện Biên Phủ, Thanh Khê, Đà Nẵng',
      price: 5500000,
      type: PropertyType.HOUSE,
      status: PropertyStatus.AVAILABLE,
      latitude: 16.0620,
      longitude: 108.1820,
      images: [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1000',
      ],
    },
    {
      title: 'Phòng trọ 15m2 giá sinh viên',
      description: 'Phòng nhỏ gọn sạch sẽ, ưu tiên 1 người ở.',
      address: 'Kiệt 40 Phan Đăng Lưu, Hải Châu, Đà Nẵng',
      price: 1500000,
      type: PropertyType.ROOM,
      status: PropertyStatus.AVAILABLE,
      latitude: 16.0380,
      longitude: 108.2180,
      images: [
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=1000',
      ],
    },
    {
      title: 'Căn hộ view biển Sơn Trà',
      description: 'Sát biển, đầy đủ tiện ích, chỉ xách vali vào ở.',
      address: 'Hoàng Sa, Sơn Trà, Đà Nẵng',
      price: 8000000,
      type: PropertyType.HOUSE,
      status: PropertyStatus.AVAILABLE,
      latitude: 16.1050,
      longitude: 108.2650,
      images: [
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000',
      ],
    },
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

  console.log('Seed data created successfully with 15 properties!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
