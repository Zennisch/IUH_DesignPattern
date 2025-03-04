package state;

public class NhanVien {

    private String name;
    private String chucVu;

    public NhanVien(String name, String chucVu) {
        this.name = name;
        this.chucVu = chucVu;
    }

    public String showChucVu() {
        StringBuilder tenCacChucVu = new StringBuilder("Danh sách các chức vụ của nhân viên " + name + ": ");
        if (chucVu.equals("Nhân viên văn phòng")) {
            tenCacChucVu.append("Thực hiện công việc được giao");
        } else if (chucVu.equals("Trưởng phòng")) {
            tenCacChucVu.append("Gán công việc cho nhân viên");
        } else if (chucVu.equals("Giám đốc")) {
            tenCacChucVu.append("Quản lý tất cả các nhân viên");
        } else {
            tenCacChucVu.append("Chức vụ không tồn tại");
        }
        return tenCacChucVu.toString();
    }


}
