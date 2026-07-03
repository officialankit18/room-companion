import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { adminApi } from "../../api/adminApi";
import { Badge, Button, Card, EmptyState, Input, PageHeader, Select, Spinner } from "../../components/ui";

export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ search: "", role: "" });
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getUsers({
        search: filters.search || undefined,
        role: filters.role || undefined,
      });
      setUsers(response.data.users);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleUser = async (user) => {
    try {
      await adminApi.updateUserStatus(user._id, !user.isActive);
      toast.success("User status updated");
      loadUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Admin" title="Manage users" description="Search users and control account active status." />
      <Card className="mb-6">
        <div className="grid gap-4 md:grid-cols-[1fr_220px_120px]">
          <Input label="Search" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <Select label="Role" value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
            <option value="">All</option>
            <option value="TENANT">Tenant</option>
            <option value="OWNER">Owner</option>
            <option value="ADMIN">Admin</option>
          </Select>
          <div className="flex items-end">
            <Button className="w-full" type="button" onClick={loadUsers}>Apply</Button>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner label="Loading users" /></div>
      ) : users.length ? (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user._id}>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="font-semibold text-[var(--color-heading)]">{user.name}</h2>
                  <p className="mt-1 text-sm text-[var(--color-body)]">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="indigo">{user.role}</Badge>
                  <Badge variant={user.isActive ? "success" : "danger"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button variant="secondary" size="sm" type="button" onClick={() => toggleUser(user)}>
                    {user.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No users found" description="Try changing your filters." />
      )}
    </>
  );
}

