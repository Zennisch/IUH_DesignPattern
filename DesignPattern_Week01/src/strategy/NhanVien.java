package strategy;

import java.util.List;

public class NhanVien {

    private String name;
    private List<ChucVu> chucVus;

    public NhanVien(String name, List<ChucVu> chucVus) {
        this.name = name;
        this.chucVus = chucVus;
    }

    public String showChucVu() {
        StringBuilder tenCacChucVu = new StringBuilder("Danh sách các chức vụ của nhân viên " + name + ": ");
        for (ChucVu chucVu : chucVus) {
            if (chucVus.indexOf(chucVu) == chucVus.size() - 1) {
                tenCacChucVu.append(chucVu.getChucVu()).append(".");
            } else {
                tenCacChucVu.append(chucVu.getChucVu()).append(", ");
            }
        }
        return tenCacChucVu.toString();
    }

}
