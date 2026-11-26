<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Room;
use App\Models\Hotel;

class RoomController extends Controller
{
 // عرض كل الغرف
 public function index()
 {
     $rooms = Room::with('hotel')->get();

     return response()->json([
         'status' => true,
         'data' => $rooms
     ]);
 }

 // عرض غرف فندق معين
 public function hotelRooms($hotelId)
 {
     $hotel = Hotel::with('rooms')->find($hotelId);

     if (!$hotel) {
         return response()->json([
             'status' => false,
             'message' => 'Hotel not found'
         ], 404);
     }

     return response()->json([
         'status' => true,
         'data' => $hotel->rooms
     ]);
 }

 public function store(Request $request)
{
    if (!$request->has('room_type') && $request->has('name')) {
        $request->merge(['room_type' => $request->input('name')]);
    }

    $validated = $request->validate([
        'hotel_id' => 'required|exists:hotels,id',
        'room_type' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price' => 'required|numeric|min:0',
        'capacity' => 'required|integer|min:1',
        'quantity' => 'required|integer|min:1',
        'image' => 'nullable|string',
        'is_available' => 'boolean',
    ]);

    $room = Room::create($validated);

    return response()->json([
        'status' => true,
        'message' => 'Room created successfully',
        'data' => $room
    ], 201);
}
public function update(Request $request, $id)
{
    $room = Room::find($id);

    if (!$room) {
        return response()->json([
            'status' => false,
            'message' => 'Room not found'
        ], 404);
    }

    $validated = $request->validate([
        'hotel_id' => 'sometimes|required|exists:hotels,id',
        'room_type' => 'sometimes|required|string|max:255',
        'description' => 'nullable|string',
        'price' => 'sometimes|required|numeric|min:0',
        'capacity' => 'sometimes|required|integer|min:1',
        'quantity' => 'sometimes|required|integer|min:1',
        'image' => 'nullable|string',
        'is_available' => 'sometimes|boolean',
    ]);

    $room->update($validated);

    return response()->json([
        'status' => true,
        'message' => 'Room updated successfully',
        'data' => $room
    ]);
}
public function destroy($id)
{
    $room = Room::find($id);

    if (!$room) {
        return response()->json([
            'status' => false,
            'message' => 'Room not found'
        ], 404);
    }

    $room->delete();

    return response()->json([
        'status' => true,
        'message' => 'Room deleted successfully'
    ]);
}
}
