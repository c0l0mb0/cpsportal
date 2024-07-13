<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WarehouseRemains extends Model

{
    use HasFactory;

    protected $fillable = ['id_worker', 'siz_item', 'posting', 'disposal'];


}
