package com.example.CarrerLink_backend.service;

import com.example.CarrerLink_backend.entity.Notification;

import java.util.List;

public interface NotificationService {

     Notification createNotification(int studentId, String message);
     List<Notification> getNotifications(int studentId);
     Notification markAsRead(Long id);
     Long getUnreadCount(int studentId);
}
