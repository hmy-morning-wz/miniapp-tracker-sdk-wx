import { dateFormat,_encodeStr,_formatExinfoParam,formatSeed,dealExtra,extend } from "../utils/common"
import 'mocha';
import * as chai from 'chai';
//.to.have.length.within(1,32);
//.to.have.lengthOf(32);
const expect = chai.expect;

describe('utils ', () => {

    it('dateFormat test' , () => {
      expect(dateFormat(Date.parse('2020-05-02 10:52:19.103'))).to.match(/^2020-05-02 10:52:19.103/);
    });
    it('_encodeStr test' , () => {
      expect(_encodeStr("2020-05-02 10:52:19.103 !@#$%^&*()~`:\"'.,<>{}")).to.match(/^((?!(,|\^)).)*$/)
    });
    it('dealExtra test' , () => {
      expect(dealExtra({test1:"test1"})).to.have.all.keys('mtr-test1')
    });
    it('extend test' , () => {
      expect(extend({test1:"test1"},{test2:"test2"})).to.have.all.keys('test1','test2')
    });
    it('formatSeed test' , () => {
      expect(formatSeed({error:new Error("mocha test"),a:1,b:2,d:Date.now()})).to.have.length.within(1,32);
    });
  
    it('_formatExinfoParam test' , () => {
      expect(_formatExinfoParam({error:new Error("mocha test"),a:"object Object",b:2,d:Date.now()})).to.match(/^((?!\[object Object\]).)*$/)  //(/^(\[object Object\])/);
    });
  });

  