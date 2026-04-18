import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { studentService } from '../api/student.service';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import StatBadge from '../components/common/StatBadge';
import ActionButton from '../components/common/ActionButton';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import type { PaginationMeta } from '../types/api';

interface StudentData {
  id: string;
  fullName: string;
  gender: string;
  phoneNumber: string;
  address: string;
  enrollmentCount: number;
}

const Students: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [students, setStudents] = useState<StudentData[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents(searchTerm, page);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, page]);

  const fetchStudents = async (search?: string, currentPage: number = 1) => {
    try {
      const res = await studentService.getAll({ 
        search,
        page: currentPage,
        limit: 10,
        include: 'enrollments'
      });
      if (res.success) {
        setStudents(res.data as unknown as StudentData[]);
        setMeta(res.meta || null);
      }
    } catch (error) {
      console.error('Failed to fetch students', error);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPage(1); // Reset to first page on search
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await studentService.delete(deleteTarget.id);
      toast.success(`Đã xóa học sinh ${deleteTarget.name} thành công`);
      fetchStudents(searchTerm, page);
    } catch (error) {
      toast.error('Không thể xóa học sinh này. Vui lòng thử lại sau.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 flex flex-col h-[calc(100vh-140px)]">
        <PageHeader 
          title="Quản lý học sinh" 
          subtitle={
            <>
              Tổng số: <span className="text-zinc-600 font-black">{meta?.totalItems || 0}</span> học sinh
            </>
          }
        >
          <div className="w-[600px]">
            <Input
              placeholder="Tìm kiếm học sinh..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onClear={() => handleSearchChange('')}
              className="text-left h-[48px] !py-0"
            />
          </div>
          <Button 
            onClick={() => navigate('/students/create')}
            className="w-auto h-[48px] !py-0 px-8 bg-zinc-900 text-white rounded-2xl shadow-2xl shadow-zinc-900/20"
          >
            Thêm học sinh
          </Button>
        </PageHeader>

        <Card className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="bg-zinc-50/50 border-b border-zinc-100/80">
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Họ tên</th>
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Liên hệ</th>
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Số lớp tham gia</th>
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50/50">
                <AnimatePresence mode="popLayout">
                  {students.map((item) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-zinc-50/30 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-[15px] font-black text-zinc-800">{item.fullName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[13px] font-bold text-zinc-500">{item.phoneNumber || 'N/A'}</span>
                      </td>
                      <td className="px-8 py-6">
                        <StatBadge value={item.enrollmentCount} label="Lớp học" />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ActionButton 
                            onClick={() => navigate(`/students/update/${item.id}?mode=view`)}
                            icon={
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            }
                            title="Xem chi tiết"
                          />
                          <ActionButton 
                            onClick={() => navigate(`/students/update/${item.id}`)}
                            icon={
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            }
                            title="Sửa"
                          />
                          <ActionButton 
                            variant="danger"
                            onClick={() => setDeleteTarget({ id: item.id, name: item.fullName })}
                            icon={
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            }
                            title="Xóa"
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                        <span className="text-[12px] font-black text-zinc-300 uppercase tracking-[0.2em]">Không tìm thấy học sinh nào</span>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {meta && (
            <Pagination
              currentPage={page}
              totalPages={meta.totalPages}
              totalItems={meta.totalItems}
              itemsPerPage={meta.itemsPerPage}
              onPageChange={setPage}
            />
          )}
        </Card>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Xóa học sinh"
        message={`Bạn có chắc chắn muốn xóa học sinh ${deleteTarget?.name}? Hành động này không thể hoàn tác.`}
      />
    </DashboardLayout>
  );
};

export default Students;
