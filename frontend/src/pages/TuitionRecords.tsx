import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { tuitionService } from '../api/tuition.service';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import ActionButton from '../components/common/ActionButton';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import type { PaginationMeta } from '../types/api';
import type { TuitionRecord } from '../types/tuition';

const TuitionRecords: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [records, setRecords] = useState<TuitionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(''); // '', 'Paid', 'Unpaid'
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [paymentTarget, setPaymentTarget] = useState<TuitionRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecords(searchTerm, page, statusFilter);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, page, statusFilter]);

  const fetchRecords = async (search?: string, currentPage: number = 1, status?: string) => {
    setLoading(true);
    try {
      const res = await tuitionService.getAll({ 
        search,
        page: currentPage,
        limit: 10,
        status: status || undefined,
        include: 'student'
      });
      if (res.success) {
        setRecords(res.data || []);
        setMeta(res.meta || null);
      }
    } catch (error) {
      console.error('Failed to fetch records', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'text-emerald-500 bg-emerald-50';
      case 'Unpaid': return 'text-amber-500 bg-amber-50';
      default: return 'text-zinc-500 bg-zinc-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Paid': return 'Đã thanh toán';
      case 'Unpaid': return 'Chưa thanh toán';
      default: return status;
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await tuitionService.delete(deleteTarget.id);
      toast.success(`Đã xóa bản ghi học phí thành công`);
      fetchRecords(searchTerm, page, statusFilter);
    } catch (error) {
      toast.error('Không thể xóa bản ghi này');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentTarget) return;
    setSubmitting(true);
    try {
      const res = await tuitionService.updateStatus(paymentTarget.id, { 
        status: 'Paid',
        paymentDate: new Date().toISOString()
      });
      if (res.success) {
        toast.success(`Xác nhận thanh toán cho học sinh ${paymentTarget.student?.fullName} thành công`);
        fetchRecords(searchTerm, page, statusFilter);
      }
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái thanh toán');
    } finally {
      setSubmitting(false);
      setPaymentTarget(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 flex flex-col h-[calc(100vh-140px)]">
        <PageHeader 
          title="Quản lý học phí" 
          subtitle={
            <>
              Tổng số: <span className="text-zinc-600 font-black">{meta?.totalItems || 0}</span> bản ghi
            </>
          }
        >
          <div className="flex items-center gap-4 w-[800px]">
            <select 
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="h-[48px] px-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-[12px] font-black uppercase tracking-wider text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all outline-none appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Paid">Đã thanh toán</option>
              <option value="Unpaid">Chưa thanh toán</option>
            </select>
            <div className="flex-1">
              <Input
                placeholder="Tìm tên học sinh..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onClear={() => handleSearchChange('')}
                className="text-left h-[48px] !py-0"
              />
            </div>
          </div>
          <Button 
            onClick={() => navigate('/tuition/create')}
            className="w-auto h-[48px] !py-0 px-8 bg-zinc-900 text-white rounded-2xl shadow-2xl shadow-zinc-900/20"
          >
            Tạo biên lai
          </Button>
        </PageHeader>

        <Card className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="bg-zinc-50/50 border-b border-zinc-100/80">
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Học sinh</th>
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Nội dung</th>
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Số tiền</th>
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ngày đóng</th>
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Trạng thái</th>
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50/50">
                <AnimatePresence mode="popLayout">
                  {records.map((item) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-zinc-50/30 transition-colors"
                    >
                      <td className="px-8 py-6 font-black text-zinc-800 text-[14px]">
                        {item.student?.fullName || 'Unknown'}
                      </td>
                      <td className="px-8 py-6 text-[13px] font-bold text-zinc-500">
                        {item.content || 'N/A'}
                      </td>
                      <td className="px-8 py-6 font-black text-zinc-900 text-[14px]">
                        {formatPrice(Number(item.amount))}
                      </td>
                      <td className="px-8 py-6 text-[13px] font-bold text-zinc-400">
                        {item.paymentDate ? new Date(item.paymentDate).toLocaleDateString('vi-VN') : '---'}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-4">
                          {/* Quick Payment Button */}
                          {item.status === 'Unpaid' && (
                            <button
                              onClick={() => setPaymentTarget(item)}
                              className="h-10 px-6 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all active:scale-95 whitespace-nowrap"
                            >
                              Thanh toán
                            </button>
                          )}

                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ActionButton 
                              onClick={() => navigate(`/tuition/update/${item.id}?mode=view`)}
                              icon={
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              }
                              title="Xem chi tiết"
                            />
                            <ActionButton 
                              onClick={() => navigate(`/tuition/update/${item.id}`)}
                              icon={
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              }
                              title="Sửa"
                            />
                            <ActionButton 
                              variant="danger"
                              onClick={() => setDeleteTarget({ id: item.id, name: item.student?.fullName || 'bản ghi này' })}
                              icon={
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              }
                              title="Xóa"
                            />
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {records.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <span className="text-[12px] font-black text-zinc-300 uppercase tracking-[0.2em]">Không tìm thấy bản ghi nào</span>
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
        title="Xóa bản ghi"
        message={`Bạn có chắc chắn muốn xóa học phí của ${deleteTarget?.name}? Hành động này không thể hoàn tác.`}
      />

      <ConfirmDialog
        isOpen={!!paymentTarget}
        onClose={() => setPaymentTarget(null)}
        onConfirm={handleConfirmPayment}
        confirmLabel="XÁC NHẬN THANH TOÁN"
        variant="success"
        isLoading={submitting}
        title="Xác nhận thanh toán"
        message={`Xác nhận học sinh ${paymentTarget?.student?.fullName} đã thanh toán số tiền ${paymentTarget ? formatPrice(Number(paymentTarget.amount)) : ''}?`}
      />
    </DashboardLayout>
  );
};

export default TuitionRecords;

