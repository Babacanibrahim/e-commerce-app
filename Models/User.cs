﻿using ECommerceApp.Models.Enums;

public class User
{
    public int Id { get; set; } 
    public string UserName { get; set; }
    public string Password { get; set; }
    public Role Role { get; set; }
}
