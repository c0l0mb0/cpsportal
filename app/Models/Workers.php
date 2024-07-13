<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workers extends Model

{
    use HasFactory;

    protected $fillable = ['id_user', 'fio', 'tab_nom', 'worker_position', 'height_next', 'electrobez_next',
        'medcheck_next', 'sex', 'height', 'clothes_size', 'shoes_size', 'hat_size', 'job_start', 'need_siz',
        'tab_nom_old', 'template_card'];


}
