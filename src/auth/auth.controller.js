import { StatusCodes } from 'http-status-codes';
export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  // 회원가입
  signUp = async (req, res) => {
    const {
      loginId,
      name,
      email,
      password,
      nickname,
      gender,
      birth,
      phoneNumber,
    } = req.body;
    const userAgent = req.headers['user-agent']
      ? req.headers['user-agent'].trim()
      : undefined;
    const userIp = req.ip ? req.ip.trim() : req.ips[0];

    await this.authService.signUp(
      loginId,
      name,
      email,
      password,
      nickname,
      gender,
      birth,
      phoneNumber,
      userIp,
      userAgent
    );

    return res.status(StatusCodes.CREATED).json({ message: '회원가입 완료.' });
  };

  // 로그인
  signIn = async (req, res) => {
    const { loginId, password } = req.body;
    const userAgent = req.headers['user-agent']
      ? req.headers['user-agent'].trim()
      : undefined;
    const userIp = req.ip ? req.ip.trim() : req.ips[0];

    const token = await this.authService.signIn(
      loginId,
      password,
      userIp,
      userAgent
    );

    return res.status(StatusCodes.OK).json({ message: '로그인 성공.', token });
  };

  // 토큰 재발급
  reisSue = async (req, res) => {
    const refreshToken = req.headers['refreshtoken'];

    const newToken = await this.authService.reisSue(refreshToken);

    return res
      .status(StatusCodes.OK)
      .json({ message: '토큰 재발급 완료.', token: newToken });
  };

  // 로그아웃
  signOut = async (req, res) => {
    const { id } = req.user;

    await this.authService.signOut(id);

    return res.status(StatusCodes.OK).json({ message: '로그아웃 성공.' });
  };
}
