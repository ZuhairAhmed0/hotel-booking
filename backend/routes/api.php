<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HotelController;

Route::get('/health', function () {
    return response('OK', 200)->header('Content-Type', 'text/plain');
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/hotels', [HotelController::class, 'index']);//عرض جميع الفنادق
Route::get('/hotels/{id}', [HotelController::class, 'show']);//عرض فندق معين
Route::post('/hotels', [HotelController::class, 'store']);//تسجيل فندق جديد
Route::put('/hotels/{id}', [HotelController::class, 'update']);//تحديث بيانات الفندق
Route::delete('/hotels/{id}', [HotelController::class, 'destroy']);//حزف الفندق

use App\Http\Controllers\Api\RoomController;
Route::get('/rooms', [RoomController::class, 'index']);//عرض الغرف
Route::get('/hotels/{hotelId}/rooms', [RoomController::class, 'hotelRooms']);//عرض غرف فندوق محدد
Route::post('/rooms', [RoomController::class, 'store']);//انشاء غرفه
Route::put('/rooms/{id}', [RoomController::class, 'update']);//تعديل الغرف
Route::delete('/rooms/{id}', [RoomController::class, 'destroy']);//حزف الغرف

use App\Http\Controllers\Api\BookingController;

Route::get('/bookings', [BookingController::class, 'index']);
Route::post('/bookings', [BookingController::class, 'store']);//إنشاء حجز جديد
Route::put('/bookings/{id}/status', [BookingController::class, 'updateStatus']);//قبول أو رفض الحجز