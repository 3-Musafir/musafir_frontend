import api from "@/lib/api";

export class RegistrationAdminService {
  static async getCheckinList(flagshipId: string) {
    return api.get(`/registration/admin/checkin/${flagshipId}`);
  }

  static async getCheckinStats(flagshipId: string) {
    return api.get(`/registration/admin/checkin-stats/${flagshipId}`);
  }

  static async updateAttendance(
    registrationId: string,
    payload: { status: "present" | "absent"; source?: string; deferPayment?: boolean }
  ) {
    return api.post(`/registration/admin/${registrationId}/attendance`, payload);
  }
}
