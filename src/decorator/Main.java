package decorator;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Nhập tên nhân viên: ");
        String ten = scanner.nextLine();

        System.out.print("Nhập chức vụ (DoiTruong, GiamDoc, NhanVienVP, NhanVienXuong, KeToanTruong): ");
        String chucVu = scanner.nextLine();

        CongViec nhanVien = new NhanVienCoBan(ten);

        switch (chucVu) {
            case "DoiTruong":
                nhanVien = new DoiTruongDecorator(nhanVien);
                break;
            case "GiamDoc":
                nhanVien = new GiamDocDecorator(nhanVien);
                break;
            case "NhanVienVP":
                nhanVien = new NhanVienVPDecorator(nhanVien);
                break;
            case "NhanVienXuong":
                nhanVien = new NhanVienXuongDecorator(nhanVien);
                break;
            case "KeToanTruong":
                nhanVien = new KeToanTruongDecorator(nhanVien);
                break;
            default:
                System.out.println("Chức vụ không hợp lệ.");
                return;
        }

        // Hiển thị công việc của nhân viên
        nhanVien.thucHien();

        scanner.close();
    }
}
