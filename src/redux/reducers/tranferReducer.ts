import { TRANSFER_FEE } from "../action/type";

export interface TransferState {
    isTranfer : boolean
}

const initState : TransferState = {
    isTranfer : false
}

const transferReducer = (state = initState, action : any) : TransferState =>{
    switch (action.type) {
        case TRANSFER_FEE:
          return { ...state, isTranfer : !state.isTranfer };
        default:
          return state;
      }
}

export default transferReducer