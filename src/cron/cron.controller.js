export class CronController {
  constructor(cronService) {
    this.cronService = cronService;
  }

  // 주기마다(1분) 업데이트
  updateViews = async () => {
    await this.cronService.updateViews();
  };

  // MongoDB에 해당 조회수 업데이트
  getViews = async () => {
    await this.cronService.getViews();
  };
}
