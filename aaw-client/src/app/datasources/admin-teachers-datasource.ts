import { BaseDataSource } from './base-datasource';
import { BaseService } from '../services/base-service';
import { environment } from 'src/environments/environment.prod';



export class AdminTeacherDataSource extends BaseDataSource {

  constructor(private _baseService: BaseService) {
    super(_baseService, environment.segmentUrls.admin.users.teacher);
  }

}

