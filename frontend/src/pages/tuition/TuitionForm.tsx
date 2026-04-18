import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/common/Card';
import { tuitionService } from '../../api/tuition.service';
import { studentService } from '../../api/student.service';
import { useToast } from '../../context/ToastContext';
import type { Student } from '../../types/student';

const TuitionForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  const isEdit = !!id;
  const isViewMode = new URLSearchParams(location.search).get('mode') === 'view';

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    content: '',
    status: 'Unpaid' as 'Paid' | 'Unpaid',
    paymentDate: ''
  });

  // Lưu lại trạng thái ban đầu để kiểm tra quy tắc "chỉ sửa nội dung"
  const [originalStatus, setOriginalStatus] = useState<string>('Unpaid');

  useEffect(() => {
    fetchStudents();
    if (isEdit) {
      fetchRecord();
    }
  }, [id]);

  const fetchStudents = async () => {
    try {
      const res = await studentService.getAll({ limit: 100 });
      if (res.success) setStudents(res.data || []);
    } catch (error) {
      console.error('Failed to fetch students', error);
    }
  };

  const fetchRecord = async () => {
    setLoading(true);
    try {
      const res = await tuitionService.getById(id!);
      if (res.success && res.data) {
        setFormData({
          studentId: res.data.studentId,
          amount: res.data.amount.toString(),
          content: res.data.content || '',
          status: res.data.status as 'Paid' | 'Unpaid',
          paymentDate: res.data.paymentDate || ''
        });
        setOriginalStatus(res.data.status);
      }
    } catch (error) {
      toast.error('Không thể lấy thông tin biên lai');
      navigate('/tuition');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.amount) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setSubmitting(true);
    try {
      const dataToSave = {
        ...formData,
        amount: Number(formData.amount),
        // Nếu chuyển sang Paid, đảm bảo có paymentDate
        paymentDate: formData.status === 'Paid' ? (formData.paymentDate || new Date().toISOString()) : null
      };

      const res = isEdit 
        ? await tuitionService.update(id!, dataToSave)
        : await tuitionService.create(dataToSave as any);

      if (res.success) {
        toast.success(`${isEdit ? 'Cập nhật' : 'Tạo'} biên lai thành công`);
        navigate('/tuition');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu dữ liệu');
    } finally {
      setSubmitting(false);
    }
  };

  // Khi sửa, khóa tất cả ngoại trừ nội dung
  const isLocked = isEdit;
  const isReadonly = isViewMode;

  return (
    <DashboardLayout>
      <div className="space-y-8 flex flex-col h-[calc(100vh-140px)]">
        <PageHeader 
          title={isEdit ? (isViewMode ? 'Chi tiết biên lai' : 'Cập nhật biên lai') : 'Tạo biên lai mới'} 
          subtitle={isEdit ? `Mã biên lai: #${id?.slice(-6).toUpperCase()}` : 'Khởi tạo biên lai học phí mới cho học sinh'}
        />
        
        <Card className="max-w-4xl p-10 overflow-y-auto">
          {loading ? (
            <div className="py-20 text-center animate-pulse">
              <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-2 gap-10">
                {/* Học sinh */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Học sinh</label>
                  <select
                    disabled={isLocked || isReadonly}
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className={`w-full h-[56px] px-6 bg-zinc-50 border border-zinc-100 rounded-2xl text-[14px] font-bold text-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none appearance-none cursor-pointer ${
                      (isLocked || isReadonly) ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">Chọn học sinh...</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>{s.fullName} - {s.studentCode}</option>
                    ))}
                  </select>
                </div>

                {/* Số tiền */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Số tiền (VNĐ)</label>
                  <Input
                    type="number"
                    disabled={isLocked || isReadonly}
                    placeholder="Ví dụ: 500000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className={isLocked || isReadonly ? 'opacity-60' : ''}
                  />
                </div>

                {/* Trạng thái */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Trạng thái</label>
                  <div className="flex bg-zinc-50 p-1.5 rounded-2xl border border-zinc-100">
                    {(['Unpaid', 'Paid'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        disabled={isLocked || isReadonly}
                        onClick={() => setFormData({ 
                          ...formData, 
                          status: s,
                          paymentDate: s === 'Paid' ? new Date().toISOString() : ''
                        })}
                        className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          formData.status === s 
                            ? (s === 'Paid' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20') 
                            : 'text-zinc-400 hover:text-zinc-600'
                        } ${(isLocked || isReadonly) && formData.status !== s ? 'hidden' : ''}`}
                      >
                        {s === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ngày thanh toán (Chỉ hiện nếu trạng thái là Paid) */}
                {formData.status === 'Paid' && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Ngày thanh toán</label>
                    <Input
                      type="date"
                      disabled={isReadonly}
                      value={formData.paymentDate ? new Date(formData.paymentDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => setFormData({ ...formData, paymentDate: new Date(e.target.value).toISOString() })}
                    />
                  </div>
                )}
              </div>

              {/* Nội dung - Luôn sửa được nếu không phải mode readonly */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Nội dung / Ghi chú</label>
                <textarea
                  disabled={isReadonly}
                  placeholder="Nhập nội dung đóng phí..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full min-h-[120px] p-6 bg-zinc-50 border border-zinc-100 rounded-3xl text-[14px] font-bold text-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none resize-none"
                />
              </div>

              {/* Actions */}
              {!isReadonly && (
                <div className="flex gap-4 pt-6 border-t border-zinc-50">
                  <Button 
                    type="button"
                    onClick={() => navigate('/tuition')} 
                    className="flex-1 h-[64px] bg-zinc-100 !text-zinc-600 !shadow-none hover:bg-zinc-200 rounded-2xl font-black uppercase tracking-widest text-[12px]"
                  >
                    Hủy bỏ
                  </Button>
                  <Button 
                    type="submit"
                    isLoading={submitting}
                    className="flex-[2] h-[64px] bg-zinc-900 text-white rounded-2xl shadow-2xl shadow-zinc-900/20 font-black uppercase tracking-widest text-[12px]"
                  >
                    {isEdit ? 'Cập nhật biên lai' : 'Tạo biên lai ngay'}
                  </Button>
                </div>
              )}
              
              {isReadonly && (
                <div className="pt-6 border-t border-zinc-50">
                   <Button 
                    onClick={() => navigate('/tuition')} 
                    className="w-full h-[64px] bg-zinc-900 text-white rounded-2xl shadow-2xl shadow-zinc-900/20 font-black uppercase tracking-widest text-[12px]"
                  >
                    Quay lại danh sách
                  </Button>
                </div>
              )}
            </form>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TuitionForm;
