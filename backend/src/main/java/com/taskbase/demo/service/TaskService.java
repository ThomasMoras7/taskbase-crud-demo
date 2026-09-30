package com.taskbase.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.taskbase.demo.model.Task;
import com.taskbase.demo.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTask(Long id) {
        return taskRepository.findById(id);
    }

    public Task createTask(String title) {
        Task task = new Task();
        task.setTitle(title);
        return taskRepository.save(task);
    }

    public Optional<Task> updateTask(Long id, String title, boolean done) {
        return taskRepository.findById(id).map(task -> {
            task.setTitle(title);
            task.setDone(done);
            return taskRepository.save(task);
        });
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

}
