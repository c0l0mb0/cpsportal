<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkerDataChanges extends Model
{
    use HasFactory;


    protected $fillable = [
        'id_equip', 'equip_deleted', 'quant', 'id_build', 'worker_comments', 'equip_updated',
        'id_build_equip', 'equip_measure', 'equip_quant', 'equip_year', 'equip_created',
    ];

}
