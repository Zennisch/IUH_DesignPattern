package strategy;

import java.util.List;

public class Main {
    public static void main(String[] args) {
        NhanVien nhanVienPhu = new NhanVien("Phú", List.of(new NhanVienVanPhong(), new TruongPhong()));
        System.out.println(nhanVienPhu.showChucVu());
    }
}
