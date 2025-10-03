// 이메일 형식 검증
export function isEmailValid(email) {
  if (!email) return false;

  if (email.length > 254) return false;

  const emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  const valid = emailRegex.test(email);
  if (!valid) return false;

  const parts = email.split('@');
  if (parts[0].length > 64) return false;

  const domainParts = parts[1].split('.');
  if (
    domainParts.some(function (part) {
      return part.length > 63;
    })
  )
    return false;

  return true;
}

// regex 모음 객체
export const regexObject = {
  email:
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/,
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/,
  phoneNumber: /^01[016789]-\d{3,4}-\d{4}$/,
};

// 날짜 가공 반환
export const dateConvert = function (date) {
  const dataDate = new Date(date);
  const month =
    dataDate.getMonth() + 1 < 10
      ? '0' + (dataDate.getMonth() + 1)
      : dataDate.getMonth() + 1;
  const day =
    dataDate.getDate() < 10 ? '0' + dataDate.getDate() : dataDate.getDate();

  return dataDate.getFullYear() + '.' + month + '.' + day;
};

// 시간 가공 반환
export const timeConvert = function (date) {
  return (
    date.getHours() +
    ':' +
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  );
};

// 두 날짜의 차이 계산
export const calculateDuration = function (startDate, endDate) {
  const diffDate = Number(
    ((endDate - startDate) / (1000 * 60 * 60 * 24)).toFixed(2)
  );

  return diffDate;
};
