import { Router } from "express";
import { Api } from "../../module/swagger/Api";
import { filterBody } from "../../module/filter/filterBody";
import { getFail } from "../../util/result";
import CODE_RULE from "../../module/CODE_RULE";
import { filterHeader } from "../../module/filter/filterHeader";
import { joinSectByStar } from "./controller/joinSectByStar";
import { filterQuery } from "../../module/filter/filterQuery";

const router = Router()

router.post(
  "/joinSectByStar" ,
  Api({
    method: "POST", 
    url: "/api/sect/joinSectByStar", 
    comment: "随机加入某个星级的宗门 ",
    group: "Sect",
    requestExample: {star: 0},
    headerExample: {token: 'eyJhbGciOiJIUzI1NiJ9.MjI0MjgxODQ2NEBxcS5jb20.9nQLJj1FElQfKxREcIsjYJQrNkhoZCMyrufJ9P9A8RM'}
  }) ,
  filterHeader([
    {
      key: "token" , 
      required: true , 
      failCode: CODE_RULE.UNLOGIN , 
      failResult: getFail(CODE_RULE.UNLOGIN , "未检测到用户登录")
    }
  ]),
  filterBody([
    {key: 'star' , required: true , failResult: getFail(CODE_RULE.ARGUMENT_ERROR , '请指定宗门星级')}
  ]),
  joinSectByStar()
)

export default router