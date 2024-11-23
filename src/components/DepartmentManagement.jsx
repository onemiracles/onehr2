import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import DepartmentService from '../services/DepartmentService';
import { Card, Button, Input, Select, Table, Loading, Pagination, Modal, ActionButtons } from './ui';
import { Form } from './ui/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faLock,
  faUnlock,
  faEdit,
  faTrash,
  faChartPie
} from '@fortawesome/free-solid-svg-icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllDepartment, fetchDepartmentStats } from '../store/departmentSlice';
import { fetchAllEmployees } from '../store/employeeSlice';

const DepartmentManagement = ({ selectedTenant }) => {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statsModalState, setStatsModalState] = useState({isOpen: false, title: 'Department Statistics'});
  const [departmentModalState, setDepartmentModalState] = useState({isOpen: false});

  const services = useMemo(() => {
    return {
      'department': new DepartmentService(selectedTenant)
    };
  }, [selectedTenant]);

  // Chart colors for department statistics
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await services['department'].getDepartments({ search: searchTerm, currentPage });
      setDepartments(response.data);
      setTotalPages(response.pagination.total);
    } catch (error) {
    console.error('Failed to fetch departments:', error);
    } finally {
    setLoading(false);
    }
  }, [services, searchTerm, currentPage]);

  useEffect(() => {fetchDepartments();}, [fetchDepartments]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const toggleStatus = async (department) => {
    try {
      await services['department'].updateStatus(department.id, department.status === 'active' ? 'inactive' : 'active');
      fetchDepartments();
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (!window.confirm('Are you sure you want to delete this department?')) {
      return;
    }

    try {
      await services['department'].deleteDepartment(departmentId);
      fetchDepartments();
    } catch (error) {
      console.error('Failed to delete department:', error);
    }
  };

  const handleOpenModal = (type, data = null) => {
    if (type === 'department') {
      setDepartmentModalState(prev => ({...prev, isOpen: true, data, title: data ? 'Edit Department' : 'Add New Department'}));
    } else if (type === 'stats') {
      setStatsModalState(prev => ({...prev, isOpen: true}));
    }
  };

  const handleCloseModal = () => {
    setDepartmentModalState(prev => ({...prev, isOpen: false}));
    setStatsModalState(prev => ({...prev, isOpen: false}));
  };

  const DepartmentModalContent = ({data}) => {
    const dispatch = useDispatch();
    const allEmployees = useSelector((state) => state.employees[selectedTenant]?.allEmployees?.data);
    const [state, setState] = useState({
      name: '',
      description: '',
      managerId: '',
      parentId: '',
      budget: '',
      headCount: '',
      status: 'active'
    });
    
    useEffect(() => {
      const newState = data ? {
        name: data.name ?? '',
        description: data.description ?? '',
        managerId: data.managerId ?? '',
        parentId: data.parentId ?? '',
        budget: data.budget ?? '',
        headCount: data.headCount ?? '',
        status: data.status ?? ''
      } : {
        name: '',
        description: '',
        managerId: '',
        parentId: '',
        budget: '',
        headCount: '',
        status: 'active'
      }
      setState(newState);
    }, [data]);
    
    useEffect(() => {
      if (!allEmployees) {
        dispatch(fetchAllEmployees({ tenantId: selectedTenant }));
      }
    }, [dispatch, allEmployees])
    
  
    const handleInputChange = (e) => {
      let { name, value, type } = e.target;
      if (type === 'number') {
        value = Number(value);
      }
      setState({ ...state, [name]: value });
    };
  
    const handleSubmit = async (e) => {
      // e.preventDefault();
      try {
        if (data) {
          await services['department'].updateDepartment(data.id, state);
        } else {
          await services['department'].createDepartment(state);
        }
        handleCloseModal();
        fetchDepartments();
        dispatch(fetchAllDepartment({ tenantId: selectedTenant }));
      } catch (error) {
        console.error('Failed to save department:', error);
      }
    };
  
    return (<Form onSubmit={handleSubmit} >
      <Input
        label="Department Name"
        name="name"
        value={state.name}
        onChange={handleInputChange}
        required
      />

      <Input
        label="Description"
        name="description"
        value={state.description}
        onChange={handleInputChange}
      />

      <Select
        label="Department Manager"
        name="managerId"
        value={state.managerId}
        onChange={handleInputChange}
        options={[
            { value: '', label: 'No Manager'},
            ...allEmployees ? allEmployees.map(employee => ({
                value: employee.id,
                label: `${employee.firstName} ${employee.lastName}`
            })): []
        ]}
      />

      <Select
        label="Parent Department"
        name="parentId"
        value={state.parentId}
        onChange={handleInputChange}
        options={[
          { value: '', label: 'None (Top Level)' },
            ...departments ? departments.filter(dept => dept.id !== data?.id)
                .map(dept => ({
                    value: dept.id,
                    label: dept.name
                })
                ) : []
        ]}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Budget"
          name="budget"
          type="number"
          value={state.budget}
          onChange={handleInputChange}
          required
        />

        <Input
          label="Head Count"
          name="headCount"
          type="number"
          value={state.headCount}
          onChange={handleInputChange}
          required
        />
      </div>

      <Select
        label="Status"
        name="status"
        value={state.status}
        onChange={handleInputChange}
        required
        options={[
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' }
        ]}
      />

      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          {data ? 'Update Department' : 'Add Department'}
        </Button>
      </div>
    </Form>);
  };

  const StatsModalContent = memo(() => {
    const dispatch = useDispatch();
    const departmentStats = useSelector((state) => state.departments[selectedTenant]?.departmentStats);

    useEffect(() => {
      if (!departmentStats) {
        dispatch(fetchDepartmentStats({ tenantId: selectedTenant }));
      }
    }, [dispatch, departmentStats]);
    
    return (departmentStats && <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="text-center">
            <h4 className="text-lg font-semibold">Total Departments</h4>
            <p className="text-3xl font-bold text-primary-600">{departmentStats.totalDepartments}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h4 className="text-lg font-semibold">Total Employees</h4>
            <p className="text-3xl font-bold text-secondary-600">{departmentStats.totalEmployees}</p>
          </div>
        </Card>
      </div>

      <Card>
        <h4 className="text-lg font-semibold mb-4">Budget Distribution</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={departmentStats.distribution}
                dataKey="departmentBudget"
                nameKey="departmentName"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {departmentStats.distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="space-y-2">
        <h4 className="text-lg font-semibold">Budget Overview</h4>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span>Total Budget</span>
            <span className="font-semibold">${departmentStats.totalBudget.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Average per Department</span>
            <span className="font-semibold">${departmentStats.averageBudget.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>);
  });

  const buttons = useCallback((dept) => [
    {
      variant: "secondary",
      caption: dept.status === 'active' ? 'Deactivate' : 'Activate',
      icon: dept.status === 'active' ? faLock : faUnlock,
      onClick: () => toggleStatus(dept),
      ariaLabel: (dept.status === 'active' ? 'Deactivate' : 'Activate') + " Department",
    },
    {
      variant: "secondary",
      caption: "Edit",
      icon: faEdit,
      onClick: () => handleOpenModal('department', dept),
      ariaLabel: "Edit Department",
    },
    {
      variant: "danger",
      caption: "Delete",
      icon: faTrash,
      onClick: () => handleDeleteDepartment(dept.id),
      ariaLabel: "Delete Department",
    },
  ]);

  return (<>
    <Modal isOpen={departmentModalState.isOpen} title={departmentModalState.title} onClose={handleCloseModal}>
      <DepartmentModalContent data={departmentModalState.data} />
    </Modal>
    <Modal isOpen={statsModalState.isOpen} title={statsModalState.title} onClose={handleCloseModal}>
      <StatsModalContent />
    </Modal>

    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4 flex-1 mr-4">
            <Input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="max-w-xs"
            />
            <Button variant="secondary" onClick={() => handleOpenModal('stats')}>
                <FontAwesomeIcon icon={faChartPie} className="mr-2" />
                View Statistics
            </Button>
            </div>
            <Button variant="primary" onClick={() => handleOpenModal('department')}>
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Department
            </Button>
        </div>

        {loading ? (
          <Loading />
        ) : (
            <>
            <Table
                headers={[
                'Name',
                'Manager',
                'Employees',
                'Budget',
                'Status',
                'Actions'
                ]}
                data={departments.map((dept) => [
                <div>
                    <div className="font-medium">{dept.name}</div>
                    <div className="text-sm text-gray-500">{dept.description}</div>
                </div>,
                dept.managerName,
                `${dept._count.employees}/${dept.headCount}`,
                `$${dept.budget.toLocaleString()}`,
                <span className={`px-2 py-1 rounded-full text-xs ${
                    dept.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                    {dept.status}
                </span>,
                <ActionButtons className="justify-end" large={false} small={false} buttons={buttons(dept)} />
                ])}
            />

            <Pagination
                currentPage={currentPage}
                total={totalPages}
                onPageChange={setCurrentPage}
            />
            </>
        )}
      </Card>
    </div>
  </>);
};

export default DepartmentManagement;