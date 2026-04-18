---
trigger: manual
---

Muc tieu

Day la rule de thuc thi `Phase 3` theo huong nhanh, gon, it loi co ban. Phase 3 chi tap trung cung co backend, khong mo rong feature moi va khong thay doi contract lon neu khong bat buoc.

Nguyen tac thuc thi

- Lam theo `boundary-first`: siet type o controller, guard, decorator, service return truoc khi dung vao logic sau ben trong.
- Lam theo `lint-by-cluster`: sua theo cum file lien quan cung mot loai loi, khong dan deu toan repo.
- Giu nguyen hanh vi truoc, siet type sau: uu tien bo `any`, `Promise<any>`, unsafe access, error handling mo ho.
- Sau moi cum sua, phai verify ngay bang lint/build dung pham vi file vua cham.
- Khong sua cung luc contract, business logic va test cu trong mot luot neu khong co blocker ro rang.

Thu tu uu tien

1. `auth` boundary
2. `users` core
3. `recommendation` core
4. `external services`
5. `scripts/test` bi anh huong boi contract moi

Khoanh vung uu tien

- `backend/src/common/decorators/get-user.decorator.ts`
- `backend/src/modules/auth/guards/optional-jwt-auth.guard.ts`
- `backend/src/modules/auth/strategies/jwt.strategy.ts`
- `backend/src/modules/auth/auth.module.ts`
- `backend/src/modules/users/users.controller.ts`
- `backend/src/modules/users/users.service.ts`
- `backend/src/modules/recommendation/recommendation.controller.ts`
- `backend/src/modules/recommendation/recommendation.service.ts`
- `backend/src/modules/recommendation/vector/vector.service.ts`
- `backend/src/modules/external/ai-orchestrator.service.ts`
- `backend/src/modules/external/gemini/gemini.service.ts`
- `backend/src/modules/external/groq/groq.service.ts`
- `backend/src/modules/external/lastfm/lastfm.service.ts`
- `backend/src/modules/external/musicbrainz/musicbrainz.service.ts`
- `backend/src/modules/external/ytdlp/ytdlp.service.ts`

Checklist cho moi cum

1. Doc boundary va khai bao ro request/response type.
2. Thay `any` bang interface nho, `unknown`, hoac typed query result.
3. Thay `catch (e)` bang narrow an toan voi `instanceof Error`.
4. Loai `Promise<any>` o controller/service boundary.
5. Chay `prettier` cho dung cum file vua sua.
6. Chay `eslint` dung cum file vua sua.
7. Neu cum pass moi chuyen sang cum tiep theo.

Loi co ban phai tranh

- Khong chay full `backend lint` tu dau khi chua khoa duoc cum dang sua.
- Khong de bien bi suy luan thanh `null` hoac `any`; khai bao ro nhu `string | null`, `Record<string, unknown>`.
- Khong truy cap truc tiep `error.message` khi chua narrow type.
- Khong vua refactor logic vua doi contract trong cung mot patch lon.
- Khong de formatter loi sau cung; phai format som de tranh loi gia do che loi that.
- Khong de external adapter tiep tuc tra du lieu mo ho neu flow loi dang dung toi no.

Mau cach verify

- Cum `auth`: `npx eslint <files-auth>` roi `npm run build`
- Cum `users/recommendation`: `npx eslint <files-core>` roi `npm run build`
- Cum `external`: `npx eslint <files-external>` roi `npm run build`

Dau hieu hoan thanh Phase 3

- Cac boundary `auth`, `users`, `recommendation` khong con `any` hoac unsafe access ro rang.
- Lint giam manh o vung loi, dac biet la `GetUser`, `JwtStrategy`, `OptionalJwtAuthGuard`, `users`, `recommendation`.
- Build backend pass on dinh sau moi cum chinh.
- Khong co regression contract voi frontend da chot o Phase 2.
