import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Authorizations } from '../../modules/authorization/types'
import {
  createOrderRequest,
  CreateOrderRequestAction
} from '../../modules/order/actions'

export type Props = {
  authorizations: Authorizations
  onCreateOrder: typeof createOrderRequest
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<Props, 'authorizations'>
export type MapDispatchProps = Pick<Props, 'onNavigate' | 'onCreateOrder'>
export type MapDispatch = Dispatch<
  CallHistoryMethodAction | CreateOrderRequestAction
>
