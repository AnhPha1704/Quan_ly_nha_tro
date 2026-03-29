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
      password: 'hashed_password', // Trong thực tế cần băm mật khẩu
      name: 'Nguyễn Văn A',
      role: Role.LANDLORD,
    },
  })

  // Danh sách nhà trọ mẫu
  const properties = [
    {
      title: 'Phòng trọ cao cấp Quận 1',
      description: 'Phòng mới xây, đầy đủ nội thất, gần chợ Bến Thành.',
      address: '123 Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM',
      price: 5000000,
      type: PropertyType.ROOM,
      status: PropertyStatus.AVAILABLE,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000',
      ],
    },
    {
      title: 'Nhà nguyên căn Thủ Đức',
      description: 'Nhà 1 trệt 1 lầu, 3 phòng ngủ, sân rộng rãi.',
      address: '45 Đường số 2, Linh Trung, Thủ Đức, TP.HCM',
      price: 15000000,
      type: PropertyType.HOUSE,
      status: PropertyStatus.AVAILABLE,
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000',
      ],
    },
    {
      title: 'Phòng trọ sinh viên giá rẻ',
      description: 'Cửa sổ thoáng mát, có gác lửng, WC riêng.',
      address: '789 Kha Vạn Cân, Linh Đông, Thủ Đức, TP.HCM',
      price: 2500000,
      type: PropertyType.ROOM,
      status: PropertyStatus.AVAILABLE,
      images: [
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=1000',
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

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
