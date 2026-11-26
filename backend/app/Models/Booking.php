<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'room_id',
        'customer_name',
        'customer_phone',
        'customer_email',
        'check_in',
        'check_out',
        'guests',
        'total_price',
        'status',
        'notes'
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
