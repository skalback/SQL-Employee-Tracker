const connection = require("./connection");

class database {
  // Keeping a reference to the connection on the class in case we need it later
  constructor(connection) {
    this.connection = connection;
  }

  // Return all employees with manager, roles and department
  listAllEmployees() {
    return this.connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    );
  }

  // Find all employees except the given employee id
  listAllPossibleManagers(employeeId) {
    return this.connection.query(
      "SELECT id, first_name, last_name FROM employee WHERE id != ?", employeeId
    );
  }

  // Add New a new employee
 insertEmployee(employee) {
    return this.connection.query(
        "INSERT INTO employee SET ?", employee
        );
  }

  // Remove an employee (uses id)
  deleteEmployee(employeeId) {
    return this.connection.query(
      "DELETE FROM employee WHERE id = ?", employeeId
    );
  }
  // Update manage of employee
  updateEmployeeManager(employeeId, managerId) {
    return this.connection.query(
      "UPDATE employee SET manager_id = ? WHERE id = ?", [managerId, employeeId]
    );
  }

  // Find all roles, join with departments to display the department name
  listAllRoles() {
    return this.connection.query(
      "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
    );
  }

  // Update the given employee's role
  updateEmployeeRole(employeeId, roleId) {
    return this.connection.query(
      "UPDATE employee SET role_id = ? WHERE id = ?", [roleId, employeeId]
    );
  }

  // Add a new role
  insertRole(role) {
    return this.connection.query("INSERT INTO role SET ?", role);
  }

  // Delete a role from the db
 deleteRole(roleId) {
    return this.connection.query("DELETE FROM role WHERE id = ?", roleId
    );
  }

  // Delete a department
 deleteDepartment(departmentId) {
    return this.connection.query(
      "DELETE FROM department WHERE id = ?", departmentId
    );
  }

  // join employees with roles
  listAllEmployeesByDepartment(departmentId) {
    return this.connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ?;",
      departmentId
    );
  }

  // join employees with departments to display roles and department names
  listAllEmployeesByManager(managerId) {
    return this.connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?;",
      managerId
    );
  }

  // Find all departments, join with employees and roles and sum up utilized department budget
  listAllDepartments() {
    return this.connection.query(
      "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM department LEFT JOIN role ON role.department_id = department.id LEFT JOIN employee ON employee.role_id = role.id GROUP BY department.id, department.name"
    );
  }

  // Add a new department
  insertDepartment(department) {
    return this.connection.query("INSERT INTO department SET ?", department
    );
  }
}

module.exports = new database(connection);
