package decorator;

interface CongViec {
    void thucHien();
}

class NhanVienCoBan implements CongViec {
    private String ten;

    public NhanVienCoBan(String ten) {
        this.ten = ten;
    }

    @Override
    public void thucHien() {
        System.out.println(ten + " là nhân viên.");
    }
}

abstract class NhanVienDecorator implements CongViec {
    protected CongViec nhanVien;

    public NhanVienDecorator(CongViec nhanVien) {
        this.nhanVien = nhanVien;
    }

    @Override
    public void thucHien() {
        nhanVien.thucHien();
    }
}

class DoiTruongDecorator extends NhanVienDecorator {
    public DoiTruongDecorator(CongViec nhanVien) {
        super(nhanVien);
    }

    @Override
    public void thucHien() {
        super.thucHien();
        System.out.println("Nhiệm vụ: Đi tuần, Gán việc cho nhân viên.");
    }
}

class GiamDocDecorator extends NhanVienDecorator {
    public GiamDocDecorator(CongViec nhanVien) {
        super(nhanVien);
    }

    @Override
    public void thucHien() {
        super.thucHien();
        System.out.println("Nhiệm vụ: Quản lý công ty, Ra quyết định quan trọng.");
    }
}

class NhanVienVPDecorator extends NhanVienDecorator {
    public NhanVienVPDecorator(CongViec nhanVien) {
        super(nhanVien);
    }

    @Override
    public void thucHien() {
        super.thucHien();
        System.out.println("Nhiệm vụ: Pha trà, Phê duyệt giấy tờ.");
    }
}

class NhanVienXuongDecorator extends NhanVienDecorator {
    public NhanVienXuongDecorator(CongViec nhanVien) {
        super(nhanVien);
    }

    @Override
    public void thucHien() {
        super.thucHien();
        System.out.println("Nhiệm vụ: Sản xuất, Kiểm tra chất lượng sản phẩm.");
    }
}

class KeToanTruongDecorator extends NhanVienDecorator {
    public KeToanTruongDecorator(CongViec nhanVien) {
        super(nhanVien);
    }

    @Override
    public void thucHien() {
        super.thucHien();
        System.out.println("Nhiệm vụ: Quản lý tài chính, Lập báo cáo kế toán.");
    }
}
