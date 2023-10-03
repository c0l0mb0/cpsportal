<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserConrtroller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::orderBy('created_at')->where('name', '!=', 'super-user')->get();
        return view('users.index', compact(['users']));
    }

    /**
     * Display all permissions of current user.
     */
    public function indexUserRoles(User $user)
    {
//        $user = User::find(1);
//        $user->roles();
//        print_r($user->roles());
//        return $user;// Returns a collection;
//        $roles = Role::orderBy('name')->get();
//        return $roles;
//        $roles = $user->getRoleNames();

//        print_r( $this->getRoleNames());
//        print_r( $user->getRoleNames()->first());
        return json_encode(Auth::user()->roles->pluck('name')[0]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $roles = Role::orderBy('name')->get();
        return view('users.edit', compact(['user', 'roles']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|max:255',
            'role_id' => 'required|integer|exists:roles,id',
        ]);
        $user->update([
            'name' => $request->name
        ]);
        $role = Role::find($request->role_id);
        $user->syncRoles($role->name);

        return redirect()->back()->with('status', 'User role updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
