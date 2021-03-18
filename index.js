const { prompt } = require('inquirer')
const db = require('./db')
require('console.table')

initialize();

function initialize() {
    console.log("**********************************************************");
    console.log("**********************************************************");
    console.log("**************    MySQL Employee Tracker    **************");
    console.log("**********************************************************");
    console.log("**********************************************************");
    console.log("");

    startMenu();
}

//Display menu options available to choose from
async function startMenu() {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "Choose from one of the options: ",
      choices: [
        {
            name: "Add New Employee",
            value: "ADD_EMPLOYEE"
        },
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES"
        },
        {
          name: "View All Employees By Department",
          value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
        },
        {
          name: "View All Employees By Manager",
          value: "VIEW_EMPLOYEES_BY_MANAGER"
        },
        {
          name: "Remove Employee",
          value: "REMOVE_EMPLOYEE"
        },
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE"
        },
        {
          name: "Update Employee Manager",
          value: "UPDATE_EMPLOYEE_MANAGER"
        },
        {
          name: "View All Roles",
          value: "VIEW_ROLES"
        },
        {
          name: "Add New Role",
          value: "ADD_ROLE"
        },
        {
          name: "Remove Role",
          value: "REMOVE_ROLE"
        },
        {
          name: "View All Departments",
          value: "VIEW_DEPARTMENTS"
        },
        {
          name: "Add New Department",
          value: "ADD_DEPARTMENT"
        },
        {
          name: "Remove Department",
          value: "REMOVE_DEPARTMENT"
        },
        {
          name: ">>> EXIT <<<",
          value: "EXIT"
        }
      ]
    }
  ]);

  // Return the data based on option selected
  switch (choice) {
    case "VIEW_EMPLOYEES":
      return viewEmployees();
    case "VIEW_EMPLOYEES_BY_DEPARTMENT":
      return viewEmployeesByDepartment();
    case "VIEW_EMPLOYEES_BY_MANAGER":
      return viewEmployeesByManager();
    case "ADD_EMPLOYEE":
      return addNewEmployee();
    case "REMOVE_EMPLOYEE":
      return removeEmployee();
    case "UPDATE_EMPLOYEE_ROLE":
      return updateEmployeeRole();
    case "UPDATE_EMPLOYEE_MANAGER":
      return updateEmployeeManager();
    case "VIEW_DEPARTMENTS":
      return viewDepartments();
    case "ADD_DEPARTMENT":
      return addDepartment();
    case "REMOVE_DEPARTMENT":
      return removeDepartment();
    case "VIEW_ROLES":
      return viewRoles();
    case "ADD_ROLE":
      return addRole();
    case "REMOVE_ROLE":
      return removeRole();
    default:
      return exit();
  }
}

//Add New employee to DB
async function addNewEmployee() {
    const roles = await db.listAllRoles();
    const employees = await db.listAllEmployees();
  
    const employee = await prompt([
      {
        name: "first_name",
        message: "Enter employee's first name:"
      },
      {
        name: "last_name",
        message: "Enter employee's last name:"
      }
    ]);
  
    const roleChoices = roles.map(({ id, title }) => ({
      name: title,
      value: id
    }));
  
    const { roleId } = await prompt({
      type: "list",
      name: "roleId",
      message: "Select employee's role:",
      choices: roleChoices
    });
  
    employee.role_id = roleId;
  
    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));
    managerChoices.unshift({ name: "N/A", value: null });
  
    const { managerId } = await prompt({
      type: "list",
      name: "managerId",
      message: "Select employee's manager (or N/A):",
      choices: managerChoices
    });
  
    employee.manager_id = managerId;
  
    await db.insertEmployee(employee);
  
    console.log("");
    console.log(`${employee.first_name} ${employee.last_name} has been successfully added to database`);
    console.log("");
  
    startMenu();
  }

//Displays all Employees
async function viewEmployees() {
  const employees = await db.listAllEmployees();

  console.log("\n");
  console.table(employees);

  startMenu();
}

async function viewEmployeesByDepartment() {
  const departments = await db.listAllDepartments();

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const { departmentId } = await prompt([
    {
      type: "list",
      name: "departmentId",
      message: "Select department to list employees:",
      choices: departmentChoices
    }
  ]);

  const employees = await db.listAllEmployeesByDepartment(departmentId);

  console.log("\n");
  console.table(employees);

  startMenu();
}

async function viewEmployeesByManager() {
  const managers = await db.listAllEmployees();

  const managerChoices = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "Select a manager to display direct reports:",
      choices: managerChoices
    }
  ]);

  const employees = await db.listAllEmployeesByManager(managerId);

  console.log("\n");

  if (employees.length === 0) {
    console.log("");
    console.log("This employee is not a manager and has no direct reports");
    console.log("");
  } else {
    console.table(employees);
  }

  startMenu();
}

async function removeEmployee() {
  const employees = await db.listAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Select employee to be removed:",
      choices: employeeChoices
    }
  ]);

  await db.deleteEmployee(employeeId);
  console.log("");
  console.log("This employee has been successfully deleted from database");
  console.log("");

  startMenu();
}

async function updateEmployeeRole() {
  const employees = await db.listAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Select employee to assign a new role:",
      choices: employeeChoices
    }
  ]);

  const roles = await db.listAllRoles();

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "Select new role to assign to employee:",
      choices: roleChoices
    }
  ]);

  await db.updateEmployeeRole(employeeId, roleId);
  console.log("");
  console.log("The employee's role has been successfully updated.");
  console.log("");

  startMenu();
}

async function updateEmployeeManager() {
  const employees = await db.listAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Select employee to be assigned to a new manager:",
      choices: employeeChoices
    }
  ]);

  const managers = await db.listAllPossibleManagers(employeeId);

  const managerChoices = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  managerChoices.unshift({ name: "No assigned manager", value: null });

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message:
        "Select new manager from the list:",
      choices: managerChoices
    }
  ]);

  await db.updateEmployeeManager(employeeId, managerId);
  console.log("");
  console.log("The employee's manager was successfully updated");
  console.log("");

  startMenu();
}

async function viewRoles() {
  const roles = await db.listAllRoles();

  console.log("\n");
  console.table(roles);
  console.log("");

  startMenu();
}

async function addRole() {
  const departments = await db.listAllDepartments();

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const role = await prompt([
    {
      name: "title",
      message: "Enter name for this role:"
    },
    {
      name: "salary",
      message: "Enter salary for this role:"
    },
    {
      type: "list",
      name: "department_id",
      message: "Select department for this role:",
      choices: departmentChoices
    }
  ]);

  await db.insertRole(role);
  console.log("");
  console.log(`${role.title} role has been successfully added to database`);
  console.log("");

  startMenu();
}

async function removeRole() {
  const roles = await db.listAllRoles();

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message:
        "Select role to be removed (PLEASE NOTE: Removing a role will delete all employees with that role)",
      choices: roleChoices
    }
  ]);

  await db.deleteRole(roleId);
  
  console.log("");
  console.log("This role has been successfully removed from the database");
  console.log("");

  startMenu();
}

async function viewDepartments() {
  const departments = await db.listAllDepartments();

  console.log("\n");
  console.table(departments);

  startMenu();
}

async function addDepartment() {
  const department = await prompt([
    {
      name: "name",
      message: "Enter department name:"
    }
  ]);

  await db.insertDepartment(department);
  console.log("");
  console.log(`${department.name} has been successfully added to database`);
  console.log("");

  startMenu();
}

async function removeDepartment() {
  const departments = await db.listAllDepartments();

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const { departmentId } = await prompt({
    type: "list",
    name: "departmentId",
    message:
      "Select department to be removed (PLEASE NOTE: Removing a department will remove all roles and employees in that department)",
    choices: departmentChoices
  });

  await db.deleteDepartment(departmentId);

  console.log("");
  console.log("Successfully removed department from the database");
  console.log("");

  startMenu();
}

function exit() {

    console.log("");
    console.log("Closing application.");
    console.log("");
    process.exit();
}
