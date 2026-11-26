<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    protected $fillable = [
        'name',
        'city',
        'address',
        'description',
        'image',
        'phone',
        'rating',
        'is_active'
    ];

    protected $appends = [
        'location',
        'main_image',
        'images',
        'number_of_reviews',
        'location_link',
        'currency'
    ];

    public function getLocationAttribute(): string
    {
        return $this->city ?? $this->address ?? '';
    }

    public function getMainImageAttribute(): ?string
    {
        return $this->image;
    }

    public function getImagesAttribute(): array
    {
        return $this->image ? [$this->image] : [];
    }

    public function getNumberOfReviewsAttribute(): int
    {
        // Deterministic realistic review count based on hotel id
        return 75 + (($this->id ?? 1) * 17) % 120;
    }

    public function getLocationLinkAttribute(): string
    {
        return 'https://www.google.com/maps/search/?api=1&query=' . urlencode(($this->name ?? '') . ' ' . ($this->city ?? ''));
    }

    public function getCurrencyAttribute(): string
    {
        return 'SDG';
    }

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }
}
