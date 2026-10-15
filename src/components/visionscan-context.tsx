import { createContext,useContext,useState,type ReactNode } from 'react';
import { queryOptions,useQueryClient,useSuspenseQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { getAccess,getOperations,leaveApp } from '@/lib/visionscan.functions';
export const accessOptions=queryOptions({queryKey:['vs-access'],queryFn:()=>getAccess(),staleTime:0});
export const operationsOptions=queryOptions({queryKey:['vs-operations'],queryFn:()=>getOperations(),staleTime:0});
const Context=createContext<ReturnType<typeof useVisionState>|null>(null);
function useVisionState(){const queryClient=useQueryClient();const {data}=useSuspenseQuery(accessOptions);const [notice,setNotice]=useState('');const leave=useServerFn(leaveApp);return {user:data.user,employees:data.employees,notice,setNotice,refresh:async()=>{await queryClient.invalidateQueries({queryKey:['vs-operations']});},logout:async()=>{await leave();queryClient.removeQueries({queryKey:['vs-operations']});await queryClient.invalidateQueries({queryKey:['vs-access']});}};}
export function VisionProvider({children}:{children:ReactNode}){const value=useVisionState();return <Context.Provider value={value}>{children}</Context.Provider>;}
export function useVision(){const ctx=useContext(Context);if(!ctx)throw new Error('VisionScan não inicializado.');return ctx;}
export function useOperations(){return useSuspenseQuery(operationsOptions).data;}