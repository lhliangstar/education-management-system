'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Button,
  Input,
  Space,
  Modal,
  Form,
  message,
  Popconfirm,
  Tag,
  Tree,
  Checkbox
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface Role {
  roleId: number;
  roleName: string;
  roleCode: string;
  roleDesc: string;
  createTime: string;
  permissions?: string[];
}

interface Permission {
  key: string;
  title: string;
  children?: Permission[];
}

// 权限树数据
const permissionTree: Permission[] = [
  {
    key: 'dashboard',
    title: '工作台',
    children: [
      { key: 'dashboard:view', title: '查看工作台' },
    ]
  },
  {
    key: 'college',
    title: '基础数据',
    children: [
      { key: 'college:view', title: '查看产业学院' },
      { key: 'college:add', title: '新增产业学院' },
      { key: 'college:edit', title: '编辑产业学院' },
      { key: 'college:delete', title: '删除产业学院' },
      { key: 'enterprise:view', title: '查看合作企业' },
      { key: 'enterprise:add', title: '新增合作企业' },
      { key: 'enterprise:edit', title: '编辑合作企业' },
      { key: 'major:view', title: '查看专业群' },
      { key: 'major:add', title: '新增专业群' },
      { key: 'major:edit', title: '编辑专业群' },
    ]
  },
  {
    key: 'governance',
    title: '治理运行',
    children: [
      { key: 'council:view', title: '查看理事会' },
      { key: 'council:add', title: '新增理事会成员' },
      { key: 'council:edit', title: '编辑理事会' },
      { key: 'meeting:view', title: '查看制度会议' },
      { key: 'meeting:add', title: '新增会议记录' },
      { key: 'meeting:edit', title: '编辑会议记录' },
    ]
  },
  {
    key: 'business',
    title: '业务数据',
    children: [
      { key: 'fund:view', title: '查看经费投入' },
      { key: 'fund:add', title: '新增经费记录' },
      { key: 'fund:edit', title: '编辑经费记录' },
      { key: 'base:view', title: '查看实训基地' },
      { key: 'base:add', title: '新增实训基地' },
      { key: 'base:edit', title: '编辑实训基地' },
      { key: 'teacher:view', title: '查看师资队伍' },
      { key: 'teacher:add', title: '新增教师' },
      { key: 'teacher:edit', title: '编辑教师' },
    ]
  },
  {
    key: 'evaluate',
    title: '评估管理',
    children: [
      { key: 'batch:view', title: '查看评估批次' },
      { key: 'batch:add', title: '新增评估批次' },
      { key: 'batch:edit', title: '编辑评估批次' },
      { key: 'index:view', title: '查看评估指标' },
      { key: 'index:add', title: '新增评估指标' },
      { key: 'index:edit', title: '编辑评估指标' },
      { key: 'fill:view', title: '数据填报' },
      { key: 'fill:submit', title: '提交填报数据' },
      { key: 'review:view', title: '专家评审' },
      { key: 'review:score', title: '评审打分' },
      { key: 'result:view', title: '查看结果公示' },
      { key: 'archive:view', title: '查看评估归档' },
      { key: 'rectify:view', title: '查看整改记录' },
      { key: 'rectify:add', title: '新增整改记录' },
    ]
  },
  {
    key: 'system',
    title: '系统管理',
    children: [
      { key: 'user:view', title: '查看用户' },
      { key: 'user:add', title: '新增用户' },
      { key: 'user:edit', title: '编辑用户' },
      { key: 'user:delete', title: '删除用户' },
      { key: 'role:view', title: '查看角色' },
      { key: 'role:add', title: '新增角色' },
      { key: 'role:edit', title: '编辑角色' },
      { key: 'dept:view', title: '查看部门' },
      { key: 'dept:add', title: '新增部门' },
      { key: 'dept:edit', title: '编辑部门' },
      { key: 'notice:view', title: '查看通知' },
      { key: 'notice:add', title: '发布通知' },
      { key: 'notice:edit', title: '编辑通知' },
    ]
  },
];

// 将权限树扁平化为数组
const flatPermissions = (permissions: Permission[]): string[] => {
  const result: string[] = [];
  const traverse = (items: Permission[]) => {
    items.forEach(item => {
      result.push(item.key);
      if (item.children) traverse(item.children);
    });
  };
  traverse(permissions);
  return result;
};

export default function RolePage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [permModalVisible, setPermModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<Partial<Role>>({});

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/system/role');
      const data = await res.json();
      if (data.success) setRoles(data.data.list || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoles(); }, []);

  const handleAdd = () => {
    setEditingRole(null);
    setFormData({});
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData(role);
    form.setFieldsValue(role);
    setModalVisible(true);
  };

  const handlePermission = (role: Role) => {
    setEditingRole(role);
    setSelectedPerms(role.permissions || []);
    setPermModalVisible(true);
  };

  const handleDelete = async (roleId: number) => {
    try {
      await fetch(`/api/system/role?roleId=${roleId}`, { method: 'DELETE' });
      message.success('删除成功');
      fetchRoles();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const method = editingRole ? 'PUT' : 'POST';
      await fetch('/api/system/role', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      message.success(editingRole ? '更新成功' : '添加成功');
      setModalVisible(false);
      fetchRoles();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handlePermSubmit = async () => {
    try {
      await fetch('/api/system/role', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId: editingRole?.roleId, permissions: selectedPerms })
      });
      message.success('权限配置成功');
      setPermModalVisible(false);
      fetchRoles();
    } catch (error) {
      message.error('权限配置失败');
    }
  };

  const onCheck = (checkedKeys: any) => {
    setSelectedPerms(checkedKeys);
  };

  const checkAll = () => {
    setSelectedPerms(flatPermissions(permissionTree));
  };

  const uncheckAll = () => {
    setSelectedPerms([]);
  };

  const columns: ColumnsType<Role> = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      render: (text: string) => <span className="font-medium">{text}</span>
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
      key: 'roleCode',
      render: (text: string) => <code className="px-2 py-1 bg-gray-100 rounded text-sm">{text}</code>
    },
    {
      title: '角色描述',
      dataIndex: 'roleDesc',
      key: 'roleDesc'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: string) => new Date(time).toLocaleDateString('zh-CN')
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handlePermission(record)}>
            <SettingOutlined /> 权限
          </Button>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            <EditOutlined /> 编辑
          </Button>
          <Popconfirm title="确定删除该角色？" onConfirm={() => handleDelete(record.roleId)}>
            <Button type="link" size="small" danger>
              <DeleteOutlined /> 删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <Card
        title="角色管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增角色
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={roles}
          loading={loading}
          rowKey="roleId"
          pagination={false}
        />
      </Card>

      {/* 角色编辑弹窗 */}
      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical" initialValues={formData}>
          <Form.Item
            name="roleName"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="roleCode"
            label="角色编码"
            rules={[{ required: true, message: '请输入角色编码' }]}
          >
            <Input placeholder="请输入角色编码，如：admin" disabled={!!editingRole} />
          </Form.Item>
          <Form.Item
            name="roleDesc"
            label="角色描述"
          >
            <Input.TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 权限配置弹窗 */}
      <Modal
        title={`配置「${editingRole?.roleName}」的权限`}
        open={permModalVisible}
        onOk={handlePermSubmit}
        onCancel={() => setPermModalVisible(false)}
        width={500}
        footer={[
          <Button key="checkAll" onClick={checkAll}>全选</Button>,
          <Button key="uncheckAll" onClick={uncheckAll}>取消全选</Button>,
          <Button key="cancel" onClick={() => setPermModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handlePermSubmit}>保存</Button>
        ]}
      >
        <div className="mb-4">
          <Tag color="blue">已选择 {selectedPerms.length} 项权限</Tag>
        </div>
        <Tree
          checkable
          defaultExpandAll
          checkedKeys={selectedPerms}
          onCheck={onCheck}
          treeData={permissionTree}
          height={400}
        />
      </Modal>
    </div>
  );
}
