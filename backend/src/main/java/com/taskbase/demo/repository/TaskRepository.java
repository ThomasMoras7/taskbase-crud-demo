package com.taskbase.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskbase.demo.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
}
