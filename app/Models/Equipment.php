<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    use HasFactory;



    protected $fillable = [
        'vadims_sort_numb', 'consist_proc', 'plant', 'component', 'primary_sens', 'engin_ia', 'engin_id',
        'engin_ua', 'engin_ud', 'engin_iuc', 'inner_equip', 'outer_equip', 'has_channels', 'to2_new', 'equip_name',
        'kind_app', 'app_to2_numb', 'programs', 'kind_signal', 'kind_app_second', 'brand_name', 'vadims_sort',
        'equip_name_extracted_type', 'equip_name_extracted_brand', 'who_change', 'who_create', 'who_delete',
    ];


}
