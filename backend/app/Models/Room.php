<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'hotel_id',
        'room_type',
        'description',
        'price',
        'capacity',
        'quantity',
        'image',
        'is_available'
    ];

    protected $appends = [
        'name',
        'features',
        'discount_available',
        'price_after_discount'
    ];

    public function getNameAttribute(): string
    {
        return $this->room_type ?? 'غرفة فندقية';
    }

    public function getFeaturesAttribute(): array
    {
        $featuresList = [
            ['واي فاي مجاني', 'تكييف هواء', 'إفطار مشمول', 'خدمة غرف 24/7'],
            ['شاشة ذكية 4K', 'واي فاي فائق السرعة', 'إطلالة بانورامية', 'ميني بار'],
            ['سرير كينغ مريح', 'حمام رخامي فاخر', 'تكييف مركزي', 'إفطار بوفيه مفتوح'],
            ['مساحة عمل مجهزة', 'إنترنت سريع', 'إطلالة على البحر/النيل', 'أريكة استرخاء']
        ];
        $index = ($this->id ?? 1) % count($featuresList);
        return $featuresList[$index];
    }

    public function getDiscountAvailableAttribute(): bool
    {
        return (($this->id ?? 1) % 3) === 0;
    }

    public function getPriceAfterDiscountAttribute(): ?float
    {
        if ($this->discount_available) {
            return round((float)$this->price * 0.85); // 15% discount
        }
        return null;
    }

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
