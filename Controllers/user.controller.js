import { v4 as uuid } from 'uuid';
import { validationResult } from 'express-validator';
import { saveData, loadData, applyFiltersAndSort } from '../utils/helpers.js';
import jwt from 'jsonwebtoken';

const tokenKey = "1234assA@SSSS";

export const createUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array().map(err => ({
            type: "field",
            msg: err.msg,
            path: err.param,
            location: err.location
        })) });
    }

    const newData = req.body;
    const id = uuid();
    
    let data = loadData(); 
    if (typeof data !== 'object') {
        data = {};
    }

    data[id] = newData; 
    saveData(data);
    res.status(201).json({ id, ...newData });
};

export const login = (req, res) => {
    const { password, email } = req.body;
    let data = loadData();

    if (!Array.isArray(data)) {
        data = [];
    }

    const user = data.find(u => u.email === email);
    if (!user) {
        return res.status(403).json({ message: "Invalid email" });
    }
    if (password !== user.password) {
        return res.status(403).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, tokenKey, { expiresIn: '1h' });
    res.status(200).json({ token });
};

export const getUsers = (req, res) => {
    const result = applyFiltersAndSort(req.query);
    res.status(200).json(result);
};

export const updateUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array().map(err => ({
            type: "field",
            msg: err.msg,
            path: err.param,
            location: err.location
        })) });
    }

    const { id } = req.query;
    let data = loadData(); 
    if (typeof data !== 'object') {
        data = {};
    }

    if (!id || !data[id]) {
        return res.status(404).json({ message: "Invalid ID" });
    }

    const updatedData = req.body;
    data[id] = { ...data[id], ...updatedData };
    saveData(data); 
    res.status(200).json(data[id]);
};

export const deleteUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array().map(err => ({
            type: "field",
            msg: err.msg,
            path: err.param,
            location: err.location
        })) });
    }

    const { id } = req.query;
    let data = loadData(); 
    if (typeof data !== 'object') {
        data = {}; 
    }

    if (!id || !data[id]) {
        return res.status(404).json({ message: "Invalid ID" });
    }

    delete data[id];
    saveData(data);
    res.status(200).json({ message: "User deleted successfully" });
};

export const updateMyprofile = (req, res) => {
    const id = req.user.id;
    let data = loadData();
    if (typeof data !== 'object') {
        data = {}; 
    }

    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    data[index] = { ...data[index], ...req.body };
    saveData(data);
    res.status(200).json({ user: data[index] });
};
