import Task from "../models/task.js";

export async function getTasks(req, res) {
  try {
    // req.user is set by protect middleware
    const tasks = await Task.find({ userId: req.user._id });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}

// Create new task
export async function createTask(req, res) {
  try {
    const { title, description } = req.body;
    if (!title || title.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      userId: req.user._id, // from middleware
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}

// Update task
export async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const task = await Task.findById(id);
    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });

    if (task.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    task.title = title ?? task.title;
    task.description = description ?? task.description;

    // Only update status if provided and valid
    if (status && ["Pending", "In Progress", "Completed"].includes(status)) {
      task.status = status;
    }

    const updatedTask = await task.save();
    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}

// Delete task
export async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });

    if (task.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await task.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}

// Get recent task activities (based on task timestamps)
export async function getRecentActivities(req, res) {
  try {
    const tasks = await Task.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })

    const activities = tasks.map((task) => {
      let action = "Updated";
      if (task.createdAt.getTime() === task.updatedAt.getTime()) {
        action = "Created";
      }
      

      return {
        taskId: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        action,
        timestamp: task.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
    console.log("this api is running");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}