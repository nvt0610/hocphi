import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { classService } from '../../api/class.service';
import { studentService } from '../../api/student.service';

interface ScheduleItem {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

const DAYS_OF_WEEK = [
  { value: 2, label: 'Thứ 2' },
  { value: 3, label: 'Thứ 3' },
  { value: 4, label: 'Thứ 4' },
  { value: 5, label: 'Thứ 5' },
  { value: 6, label: 'Thứ 6' },
  { value: 7, label: 'Thứ 7' },
  { value: 8, label: 'Chủ Nhật' },
];

const ClassForm: React.FC = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const toast = useToast();
   const [searchParams] = useSearchParams();
   const isEdit = !!id;
   const isView = searchParams.get('mode') === 'view';

  const [formData, setFormData] = useState({
    className: '',
    description: '',
    monthlyFee: 0
  });

  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    initData();
  }, [id]);

  const initData = async () => {
    setFetching(true);
    try {
      // Load all students for the list
      // Load students with higher limit for the selection list
      const res = await studentService.getAll({ limit: 1000 });
      if (res.success) {
        setAllStudents(res.data || []);
      }

      if (isEdit) {
        const resClass = await classService.getById(id!);
        if (resClass.success) {
          const classData = resClass.data;
          setFormData({
            className: classData.className || '',
            description: classData.description || '',
            monthlyFee: Number(classData.monthlyFee) || 0
          });
          
          // Extract schedules and students if they exist
          if (classData.schedules) {
            setSchedules(classData.schedules.map((s: any) => ({
              dayOfWeek: s.dayOfWeek,
              startTime: s.startTime.substring(0, 5), // '08:00:00' -> '08:00'
              endTime: s.endTime.substring(0, 5)
            })));
          }

          if (classData.enrollments) {
            setSelectedStudentIds(classData.enrollments.map((e: any) => e.studentId));
          }
        }
      }
    } catch (error) {
      console.error('Failed to init data', error);
      alert('Không thể tải dữ liệu');
    } finally {
      setFetching(false);
    }
  };

  const addSchedule = () => {
    setSchedules([...schedules, { dayOfWeek: 2, startTime: '08:00', endTime: '09:30' }]);
  };

  const removeSchedule = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const updateSchedule = (index: number, field: keyof ScheduleItem, value: any) => {
    const newSchedules = [...schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setSchedules(newSchedules);
  };

  const toggleStudent = (studentId: string) => {
    if (selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds(selectedStudentIds.filter(id => id !== studentId));
    } else {
      setSelectedStudentIds([...selectedStudentIds, studentId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.className.trim()) {
      toast.warning('Vui lòng nhập tên lớp học');
      return;
    }

    setLoading(true);
    const payload = {
      ...formData,
      schedules,
      studentIds: selectedStudentIds
    };

    try {
      if (isEdit) {
        await classService.update(id!, payload);
        toast.success(`Cập nhật lớp học ${formData.className} thành công`);
      } else {
        await classService.create(payload);
        toast.success(`Tạo lớp học ${formData.className} thành công`);
      }
      navigate('/classes');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = allStudents.filter(s => 
    s.fullName.toLowerCase().includes(studentSearch.toLowerCase())
  );

  if (fetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <span className="text-zinc-400 font-black animate-pulse uppercase tracking-[0.3em]">Đang chuẩn bị dữ liệu...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 flex flex-col pb-20">
        <div className="w-full">
          <PageHeader 
            title={isEdit ? (isView ? 'Chi tiết lớp học' : 'Cập nhật lớp học') : 'Thêm lớp học mới'} 
            subtitle={isEdit ? (isView ? `Xem thông tin lớp: ${formData.className}` : `Chỉnh sửa lớp: ${formData.className}`) : 'Thiết lập thông tin lớp, lịch học và danh sách học sinh'}
            showBack
            onBack={() => navigate(-1)}
          />
        </div>

        <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: General Info & Schedule */}
          <div className="lg:col-span-8 space-y-8 flex flex-col h-[calc(100vh-200px)]">
            {/* Reduced height Basic Info */}
            <div className="bg-white p-6 rounded-[32px] border border-zinc-100 shadow-2xl shadow-zinc-200/50 space-y-6">
              <h3 className="text-[12px] font-black text-zinc-800 uppercase tracking-[0.2em] border-l-4 border-zinc-900 pl-4 py-0.5">Thông tin cơ bản</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Tên lớp học</label>
                  <Input
                    required
                    placeholder="Ví dụ: Lớp Toán 10A1"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="h-[52px] text-[16px] font-bold px-6 rounded-2xl"
                    disabled={isView}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Học phí / Tháng</label>
                  <div className="relative">
                    <Input
                      placeholder="Ví dụ: 500,000"
                      value={formData.monthlyFee ? new Intl.NumberFormat('vi-VN').format(formData.monthlyFee) : ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\./g, '');
                        if (!isNaN(Number(val))) {
                          setFormData({ ...formData, monthlyFee: Number(val) });
                        }
                      }}
                      className="h-[52px] text-[16px] font-bold px-6 pr-16 rounded-2xl"
                      disabled={isView}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[12px] font-black text-zinc-400">VNĐ</span>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Mô tả ngắn</label>
                  <textarea
                    placeholder="Nhập mô tả về lớp học..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full min-h-[80px] p-6 bg-zinc-50 border border-zinc-100 rounded-[24px] text-[15px] font-bold text-zinc-800 focus:outline-none focus:ring-8 focus:ring-zinc-900/5 transition-all outline-none resize-none placeholder:text-zinc-300"
                  />
                </div>
              </div>
            </div>

            {/* Scrollable Schedule Detail */}
            <div className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-2xl shadow-zinc-200/50 space-y-6 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-black text-zinc-800 uppercase tracking-[0.2em] border-l-4 border-zinc-900 pl-4 py-0.5">Lịch học chi tiết</h3>
                {!isView && (
                  <Button 
                    type="button" 
                    onClick={addSchedule}
                    className="w-auto !py-2.5 !px-6 bg-zinc-900 !text-white hover:bg-zinc-800 rounded-2xl text-[10px] font-black shadow-xl shadow-zinc-900/20 tracking-widest"
                  >
                    + THÊM CA
                  </Button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                  {schedules.map((schedule, index) => (
                    <div key={index} className="flex flex-col gap-3 p-5 bg-zinc-50 rounded-[28px] border border-zinc-100 animate-in fade-in zoom-in-95 duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ca #{index + 1}</span>
                        {!isView && (
                          <button
                            type="button"
                            onClick={() => removeSchedule(index)}
                            className="p-1.5 text-red-300 hover:text-red-500 transition-all hover:bg-red-50 rounded-xl"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <select
                          value={schedule.dayOfWeek}
                          onChange={(e) => updateSchedule(index, 'dayOfWeek', Number(e.target.value))}
                          className="w-full h-[48px] px-5 bg-white border border-zinc-200 rounded-xl text-xs font-black text-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                          disabled={isView}
                        >
                          {DAYS_OF_WEEK.map(day => (
                            <option key={day.value} value={day.value}>{day.label}</option>
                          ))}
                        </select>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={schedule.startTime}
                            onChange={(e) => updateSchedule(index, 'startTime', e.target.value)}
                            className="w-full h-[48px] px-5 bg-white border border-zinc-200 rounded-xl text-xs font-black text-zinc-800 focus:outline-none "
                          />
                          <span className="text-zinc-300 font-bold">→</span>
                          <input
                            type="time"
                            value={schedule.endTime}
                            onChange={(e) => updateSchedule(index, 'endTime', e.target.value)}
                            className="w-full h-[48px] px-5 bg-white border border-zinc-200 rounded-xl text-xs font-black text-zinc-800 focus:outline-none "
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {schedules.length === 0 && (
                    <div className="md:col-span-2 py-12 text-center border-2 border-dashed border-zinc-50 rounded-[32px]">
                      <span className="text-[11px] font-black text-zinc-200 uppercase tracking-[0.2em]">Hãy thêm ít nhất một ca học</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Student List */}
          <div className="lg:col-span-4 space-y-8 h-full sticky top-8">
            <div className="bg-white p-10 rounded-[40px] border border-zinc-100 shadow-2xl shadow-zinc-200/50 flex flex-col h-[calc(100vh-160px)]">
              <div className="space-y-1 mb-8">
                <h3 className="text-[14px] font-black text-zinc-800 uppercase tracking-[0.2em] border-l-4 border-zinc-900 pl-6 py-1">Học sinh</h3>
                <p className="text-[11px] font-bold text-zinc-400 pl-7">Đã chọn {selectedStudentIds.length} / {allStudents.length} học sinh</p>
              </div>

              <div className="relative mb-6">
                <Input
                  placeholder="Tìm học sinh theo tên..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="h-[56px] text-sm font-bold pr-12 rounded-2xl bg-zinc-50 border-transparent focus:bg-white"
                />
                <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {filteredStudents.map((student) => {
                  const isSelected = selectedStudentIds.includes(student.id);
                  return (
                    <div 
                      key={student.id}
                      onClick={() => !isView && toggleStudent(student.id)}
                      className={`flex items-center gap-4 p-5 rounded-3xl transition-all border-2 group ${
                        isView ? 'cursor-default' : 'cursor-pointer'
                      } ${
                        isSelected 
                          ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-900/20' 
                          : 'bg-zinc-50 border-zinc-50 hover:border-zinc-200 text-zinc-700'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'bg-white border-white scale-110' : 'bg-white border-zinc-200 group-hover:border-zinc-300'
                      }`}>
                        {isSelected && (
                          <svg className="w-4 h-4 text-zinc-900" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[15px] font-black truncate">{student.fullName}</span>
                      </div>
                    </div>
                  );
                })}
                {filteredStudents.length === 0 && (
                  <div className="py-20 text-center">
                    <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-black text-zinc-200 uppercase tracking-widest">Không tìm thấy học sinh</span>
                  </div>
                )}
              </div>

              <div className="pt-8 mt-6 border-t border-zinc-100 flex gap-4">
                <Button 
                  type="button"
                  onClick={() => navigate('/classes')} 
                  className={`flex-1 h-[64px] bg-zinc-100 !text-zinc-400 !shadow-none hover:bg-zinc-200 rounded-3xl font-black text-xs tracking-[0.2em] ${isView ? 'hidden' : ''}`}
                >
                  HỦY
                </Button>
                <Button 
                  type={isView ? 'button' : 'submit'}
                  onClick={isView ? () => navigate('/classes') : undefined}
                  isLoading={loading}
                  className="flex-[2] h-[64px] bg-zinc-900 text-white rounded-3xl shadow-2xl shadow-zinc-900/30 font-black text-xs tracking-[0.2em]"
                >
                  {isView ? 'QUAY LẠI' : (isEdit ? 'CẬP NHẬT' : 'TẠO LỚP')}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ClassForm;
