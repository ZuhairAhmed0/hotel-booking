<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Room;
class BookingController extends Controller
{
     // عرض جميع الحجوزات
     public function index(){
         $bookings = Booking::with('room.hotel')
             ->latest()
             ->get();
 
         return response()->json([
             'status' => true,
             'data' => $bookings
         ]);
     }

     public function store(Request $request)
     {
         // Normalize input parameters from either frontend or standard API payload
         $request->merge([
             'customer_name' => $request->input('customer_name') ?: $request->input('full_name'),
             'customer_phone' => $request->input('customer_phone') ?: $request->input('phone_number'),
             'customer_email' => $request->input('customer_email') ?: $request->input('email'),
             'check_in' => $request->input('check_in') ?: $request->input('arrive_date'),
             'check_out' => $request->input('check_out') ?: $request->input('leave_date'),
             'guests' => $request->input('guests') ?: $request->input('number_of_guests', 1),
         ]);

         $validated = $request->validate([
             'room_id' => 'required|exists:rooms,id',
             'customer_name' => 'required|string|max:255',
             'customer_phone' => 'required|string|max:30',
             'customer_email' => 'nullable|email',
             'check_in' => 'required|date',
             'check_out' => 'required|date|after:check_in',
             'guests' => 'required|integer|min:1',
             'notes' => 'nullable|string',
         ]);

         $room = Room::findOrFail($validated['room_id']);
         $existingBookings = Booking::where('room_id', $room->id)
             ->whereIn('status', ['pending', 'confirmed'])
             ->where('check_in', '<', $validated['check_out'])
             ->where('check_out', '>', $validated['check_in'])
             ->count();

         if ($existingBookings >= $room->quantity) {
             return response()->json([
                 'status' => false,
                 'message' => 'عذراً، لا توجد غرف متاحة في هذه الفترة'
             ], 422);
         }

         if ($validated['guests'] > $room->capacity) {
             return response()->json([
                 'status' => false,
                 'message' => 'عدد الأشخاص أكبر من سعة الغرفة'
             ], 422);
         }

         $nights = max(1, (int)\Carbon\Carbon::parse($validated['check_in'])
             ->diffInDays(\Carbon\Carbon::parse($validated['check_out'])));

         $effectivePrice = $room->discount_available && $room->price_after_discount
             ? $room->price_after_discount
             : $room->price;

         $totalPrice = $nights * $effectivePrice;

         $booking = Booking::create([
             'room_id' => $validated['room_id'],
             'customer_name' => $validated['customer_name'],
             'customer_phone' => $validated['customer_phone'],
             'customer_email' => $validated['customer_email'] ?? null,
             'check_in' => $validated['check_in'],
             'check_out' => $validated['check_out'],
             'guests' => $validated['guests'],
             'total_price' => $totalPrice,
             'status' => 'pending',
             'notes' => $validated['notes'] ?? null,
         ]);

         return response()->json([
             'status' => true,
             'message' => 'Booking created successfully',
             'data' => $booking
         ], 201);
     }

public function updateStatus(Request $request, $id){
    $validated = $request->validate([
        'status' => 'required|in:confirmed,rejected',
    ]);

    $booking = Booking::find($id);

    if (!$booking) {
        return response()->json([
            'status' => false,
            'message' => 'Booking not found'
        ], 404);
    }

    $booking->update([
        'status' => $validated['status']
    ]);

    return response()->json([
        'status' => true,
        'message' => 'Booking status updated successfully',
        'data' => $booking
    ]);
}
}
