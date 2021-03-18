use employee_db;

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('IT'),
    ('HR');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Manager', 85000, 1),
    ('Salesperson', 50000, 1),
    ('IT Manager', 100000, 2),
    ('Project Manager', 90000, 2),
    ('Software Developer', 95000, 2),
    ('QA Tester', 75000, 2),
    ('HR Manager', 70000, 3),
    ('HR Specialist', 65000, 3);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Jaime', 'Rodriguez', 1, NULL),
    ('Harold', 'Smith', 2, 1),
    ('Joann', 'Murphy', 3, NULL),
    ('Seth', 'Kalback', 5, 3),
    ('Derek', 'Brown', 6, 3),
    ('Elise', 'Siegel', 4, 3),
    ('Kaysa', 'Wingate', 7, NULL),
    ('Javiera', 'Guzman', 8, 7);

