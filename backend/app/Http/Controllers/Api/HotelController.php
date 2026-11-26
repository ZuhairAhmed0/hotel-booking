<?php

namespace App\Http\Controllers\Api;
use App\Models\Hotel;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HotelController extends Controller
{
      // عرض جميع الفنادق
      public function index()
      {
          $hotels = Hotel::with('rooms')
              ->where('is_active', true)
              ->get();
  
          return response()->json([
              'status' => true,
              'message' => 'Hotels retrieved successfully',
              'data' => $hotels
          ]);
      }
  
      // عرض تفاصيل فندق واحد
      public function show($id)
      {
          $hotel = Hotel::with('rooms')
              ->where('is_active', true)
              ->find($id);
  
          if (!$hotel) {
              return response()->json([
                  'status' => false,
                  'message' => 'Hotel not found'
              ], 404);
          }
  
          return response()->json([
              'status' => true,
              'data' => $hotel
          ]);
      }
      public function store(Request $request)
{
    if (!$request->has('city') && $request->has('location')) {
        $request->merge(['city' => $request->input('location')]);
    }
    if (!$request->has('image') && $request->has('main_image')) {
        $request->merge(['image' => $request->input('main_image')]);
    }

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'city' => 'required|string|max:255',
        'address' => 'nullable|string',
        'description' => 'nullable|string',
        'phone' => 'nullable|string',
        'image' => 'nullable|string',
        'rating' => 'nullable|numeric|min:0|max:5',
    ]);

    $hotel = Hotel::create($validated);

    return response()->json([
        'status' => true,
        'message' => 'Hotel created successfully',
        'data' => $hotel
    ], 201);
}

public function update(Request $request, $id)
{
    $hotel = Hotel::find($id);

    if (!$hotel) {
        return response()->json([
            'status' => false,
            'message' => 'Hotel not found'
        ], 404);
    }

    $validated = $request->validate([
        'name' => 'sometimes|required|string|max:255',
        'city' => 'sometimes|required|string|max:255',
        'address' => 'nullable|string',
        'description' => 'nullable|string',
        'phone' => 'nullable|string',
        'image' => 'nullable|string',
        'rating' => 'nullable|numeric|min:0|max:5',
        'is_active' => 'sometimes|boolean',
    ]);

    $hotel->update($validated);

    return response()->json([
        'status' => true,
        'message' => 'Hotel updated successfully',
        'data' => $hotel
    ]);
}

public function destroy($id){
    $hotel = Hotel::find($id);

    if (!$hotel) {
        return response()->json([
            'status' => false,
            'message' => 'Hotel not found'
        ], 404);
    }

    $hotel->delete();

    return response()->json([
        'status' => true,
        'message' => 'Hotel deleted successfully'
    ]);
}
}
