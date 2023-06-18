<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CpsStuff extends Model
{
    protected $table = 'cps_stuff';
    protected $fillable = [
        'name', 'quantity', 'measure'
    ];
    use HasFactory;
}
