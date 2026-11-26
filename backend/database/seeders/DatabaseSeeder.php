<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Hotel;
use App\Models\Room;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Default admin / test user
        User::firstOrCreate(
            ['email' => 'admin@iqama.sd'],
            [
                'name' => 'مدير النظام',
                'password' => bcrypt('password123'),
            ]
        );

        $hotelsData = [
            [
                'name' => 'فندق كورنثيا',
                'city' => 'الخرطوم',
                'address' => 'شارع النيل، منطقة المقرن، الخرطوم',
                'description' => 'يقع فندق كورنثيا الخرطوم في قلب العاصمة عند ملتقى النيلين الأبيض والأزرق في تصميم معماري أيقوني فريد يجمع بين الفخامة والخدمات العالمية.',
                'image' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
                'phone' => '+249187155555',
                'rating' => 4.8,
                'is_active' => true,
                'rooms' => [
                    [
                        'room_type' => 'غرفة ديلوكس مطلة على النيل',
                        'description' => 'غرفة رحبة بتصميم عصري راقٍ وإطلالة خلابة ومباشرة على ملتقى النيلين.',
                        'price' => 200000,
                        'capacity' => 2,
                        'quantity' => 10,
                        'image' => 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
                        'is_available' => true,
                    ],
                    [
                        'room_type' => 'جناح تنفيذي ملكي',
                        'description' => 'جناح فسيح يضم غرفة معيشة مستقلة ومكتب عمل وخدمات ضيافة خاصة لرجال الأعمال.',
                        'price' => 350000,
                        'capacity' => 3,
                        'quantity' => 5,
                        'image' => 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
                        'is_available' => true,
                    ],
                    [
                        'room_type' => 'غرفة بريميوم كينغ',
                        'description' => 'سرير كينغ مريح للغاية مع حمام رخامي متكامل وشرفة خاصة هادئة.',
                        'price' => 180000,
                        'capacity' => 2,
                        'quantity' => 8,
                        'image' => 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
                        'is_available' => true,
                    ]
                ]
            ],
            [
                'name' => 'فندق القراند هوتيل',
                'city' => 'الخرطوم',
                'address' => 'شارع النيل، بجوار متحف السودان القومي، الخرطوم',
                'description' => 'فندق تاريخي عريق على ضفاف النيل الأزرق يتميز بطابعه الاستعماري الكلاسيكي وسط حدائق غناء هادئة.',
                'image' => 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
                'phone' => '+249183777777',
                'rating' => 4.9,
                'is_active' => true,
                'rooms' => [
                    [
                        'room_type' => 'غرفة تراثية كلاسيكية',
                        'description' => 'أجواء تاريخية ساحرة مع أثاث خشبي راقٍ وتجهيزات فندقية مريحة.',
                        'price' => 160000,
                        'capacity' => 2,
                        'quantity' => 8,
                        'image' => 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
                        'is_available' => true,
                    ],
                    [
                        'room_type' => 'جناح القراند الفاخر',
                        'description' => 'إطلالة مباشرة على النيل الأزرق وتراس خاص للاستمتاع بغروب الشمس الساحر.',
                        'price' => 280000,
                        'capacity' => 4,
                        'quantity' => 4,
                        'image' => 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
                        'is_available' => true,
                    ]
                ]
            ],
            [
                'name' => 'فندق السلام روتانا',
                'city' => 'الخرطوم',
                'address' => 'شارع إفريقيا (شارع المطار)، الخرطوم',
                'description' => 'عنوان الرفاهية والراحة لرجال الأعمال والعائلات بالقرب من المطار، ويضم مسابح ومرافق استجمام متكاملة.',
                'image' => 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
                'phone' => '+249187007777',
                'rating' => 4.7,
                'is_active' => true,
                'rooms' => [
                    [
                        'room_type' => 'غرفة كلاسيك مزدوجة',
                        'description' => 'تجهيزات راقية وخدمة استثنائية مع مسبح مجاني ونادي صحي.',
                        'price' => 170000,
                        'capacity' => 2,
                        'quantity' => 12,
                        'image' => 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
                        'is_available' => true,
                    ],
                    [
                        'room_type' => 'جناح السلام الدبلوماسي',
                        'description' => 'مساحة فسيحة مع قاعة اجتماعات مصغرة وخدمات حصرية.',
                        'price' => 310000,
                        'capacity' => 3,
                        'quantity' => 4,
                        'image' => 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
                        'is_available' => true,
                    ]
                ]
            ],
            [
                'name' => 'فندق مارينا بورتسودان',
                'city' => 'بورتسودان',
                'address' => 'كورنيش بورتسودان، البحر الأحمر',
                'description' => 'إقامة ساحلية ساحرة بإطلالة بانورامية على مياه البحر الأحمر واليخوت، مع خدمات غوص ورحلات بحرية متميزة.',
                'image' => 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
                'phone' => '+249311822333',
                'rating' => 4.8,
                'is_active' => true,
                'rooms' => [
                    [
                        'room_type' => 'غرفة مطلة على البحر الأحمر',
                        'description' => 'استيقظ على نسيم البحر وإطلالة مباشرة على مياه البحر الأحمر الفيروزية.',
                        'price' => 150000,
                        'capacity' => 2,
                        'quantity' => 10,
                        'image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
                        'is_available' => true,
                    ],
                    [
                        'room_type' => 'جناح المارينا البانورامي',
                        'description' => 'شرفة واسعة بزاوية 180 درجة على البحر مع غرفة معيشة راقية وجاكوزي خاص.',
                        'price' => 260000,
                        'capacity' => 4,
                        'quantity' => 4,
                        'image' => 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
                        'is_available' => true,
                    ]
                ]
            ],
            [
                'name' => 'فندق بوغنفيل بورتسودان',
                'city' => 'بورتسودان',
                'address' => 'حي الشاطئ، بورتسودان',
                'description' => 'هدوء وراحة في أجواء شاطئية أنيقة ومساحات خضراء، مثالي للعائلات وزوار عروس البحر الأحمر.',
                'image' => 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
                'phone' => '+249311824444',
                'rating' => 4.6,
                'is_active' => true,
                'rooms' => [
                    [
                        'room_type' => 'غرفة حديقة هادئة',
                        'description' => 'أجواء مريحة محاطة بالأشجار والزهور الاستوائية وقريبة من الشاطئ.',
                        'price' => 130000,
                        'capacity' => 2,
                        'quantity' => 8,
                        'image' => 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef3?auto=format&fit=crop&w=800&q=80',
                        'is_available' => true,
                    ],
                    [
                        'room_type' => 'جناح عائلي واسع',
                        'description' => 'مثالي للعائلات، يضم غرفتي نوم وصالة معيشة مع مطبخ تحضيري صغير.',
                        'price' => 220000,
                        'capacity' => 4,
                        'quantity' => 5,
                        'image' => 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
                        'is_available' => true,
                    ]
                ]
            ],
            [
                'name' => 'فندق كورال بورتسودان',
                'city' => 'بورتسودان',
                'address' => 'الممشى السياحي والميناء، بورتسودان',
                'description' => 'موقع استراتيجي ومرافق عصرية متكاملة توفر تجربة إقامة مريحة في قلب مدينة بورتسودان النابضة بالحياة.',
                'image' => 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
                'phone' => '+249311825555',
                'rating' => 4.7,
                'is_active' => true,
                'rooms' => [
                    [
                        'room_type' => 'غرفة سوبيريور مفردة/مزدوجة',
                        'description' => 'إقامة حديثة مجهزة بكافة سبل الراحة ومكتب عمل وشبكة واي فاي سريعة.',
                        'price' => 140000,
                        'capacity' => 2,
                        'quantity' => 10,
                        'image' => 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
                        'is_available' => true,
                    ],
                    [
                        'room_type' => 'جناح رجال الأعمال',
                        'description' => 'تجهيزات متقدمة ومساحة مريحة للاسترخاء وإنجاز الأعمال في آن واحد.',
                        'price' => 240000,
                        'capacity' => 2,
                        'quantity' => 4,
                        'image' => 'https://images.unsplash.com/photo-1587985064135-0366536eab42?auto=format&fit=crop&w=800&q=80',
                        'is_available' => true,
                    ]
                ]
            ],
            [
                'name' => 'فندق قصر الضيافة أمدرمان',
                'city' => 'أمدرمان',
                'address' => 'شارع النيل، بالقرب من بوابة عبد القيوم، أمدرمان',
                'description' => 'إقامة أصيلة تعكس روح أمدرمان التاريخية وتراثها الثقافي، مع إطلالة هادئة ومميزة على ضفاف النيل.',
                'image' => 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80',
                'phone' => '+249187551122',
                'rating' => 4.5,
                'is_active' => true,
                'rooms' => [
                    [
                        'room_type' => 'غرفة أمدرمان التراثية',
                        'description' => 'طابع سوداني أصيل وديكورات تقليدية مميزة مع كامل وسائل الراحة الحديثة.',
                        'price' => 110000,
                        'capacity' => 2,
                        'quantity' => 8,
                        'image' => 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
                        'is_available' => true,
                    ],
                    [
                        'room_type' => 'جناح الضيافة الفاخر',
                        'description' => 'جناح عائلي واسع يوفر الخصوصية والراحة مع خدمة ضيافة سودانية كريمة.',
                        'price' => 190000,
                        'capacity' => 3,
                        'quantity' => 4,
                        'image' => 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
                        'is_available' => true,
                    ]
                ]
            ],
            [
                'name' => 'فندق ملتقى النيلين أمدرمان',
                'city' => 'أمدرمان',
                'address' => 'حي الملازمين، أمدرمان',
                'description' => 'بالقرب من معالم أمدرمان وأسواقها الشعبية العريقة، يوفر غرفاً مريحة بأسعار مناسبة وخدمة ودودة.',
                'image' => 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
                'phone' => '+249187553344',
                'rating' => 4.4,
                'is_active' => true,
                'rooms' => [
                    [
                        'room_type' => 'غرفة قياسية مزدوجة',
                        'description' => 'غرفة مريحة وهادئة ومناسبة للمسافرين والزوار الباحثين عن إقامة اقتصادية ممتازة.',
                        'price' => 95000,
                        'capacity' => 2,
                        'quantity' => 8,
                        'image' => 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
                        'is_available' => true,
                    ],
                    [
                        'room_type' => 'غرفة عائلية متصلة',
                        'description' => 'غرفتان متصلتان تناسبان العائلات التي ترغب في البقاء معاً براحة وسكينة.',
                        'price' => 160000,
                        'capacity' => 4,
                        'quantity' => 4,
                        'image' => 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
                        'is_available' => true,
                    ]
                ]
            ]
        ];

        foreach ($hotelsData as $hotelItem) {
            $rooms = $hotelItem['rooms'];
            unset($hotelItem['rooms']);

            $hotel = Hotel::updateOrCreate(
                ['name' => $hotelItem['name'], 'city' => $hotelItem['city']],
                $hotelItem
            );

            foreach ($rooms as $roomItem) {
                Room::updateOrCreate(
                    [
                        'hotel_id' => $hotel->id,
                        'room_type' => $roomItem['room_type']
                    ],
                    array_merge($roomItem, ['hotel_id' => $hotel->id])
                );
            }
        }
    }
}
