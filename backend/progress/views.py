from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Q
from users.models import Usuario
from records.models import RegistroHoras
from .serializers import ProgresoMetaSerializer, ProgresoGeneralSerializer
from users.permissions import IsAdministrador

class ProgressViewSet(viewsets.ViewSet):
    
    @action(detail=False, methods=['get'])
    def mi_progreso(self, request):
        user = request.user
        
        # Calcular horas aprobadas por tipo de actividad
        horas_por_tipo = RegistroHoras.objects.filter(
            becario=user, 
            estado_aprobacion='A'
        ).values('actividad__tipo').annotate(
            total_horas=Sum('horas_reportadas')
        )
        
        # Mapear tipos de actividad a metas
        metas_map = {
            'Interna': user.meta_horas_voluntariado_interno,
            'Externa': user.meta_horas_voluntariado_externo,
            'Chat': user.meta_horas_chat_ingles,
            'Taller': user.meta_horas_talleres,
        }
        
        progreso = []
        for tipo_data in horas_por_tipo:
            tipo = tipo_data['actividad__tipo']
            horas_alcanzadas = tipo_data['total_horas'] or 0
            meta = metas_map.get(tipo, 0)
            
            progreso.append({
                'tipo_actividad': tipo,
                'horas_objetivo': meta,
                'horas_alcanzadas': horas_alcanzadas,
                'porcentaje': (horas_alcanzadas / meta * 100) if meta > 0 else 0,
                'horas_restantes': max(meta - horas_alcanzadas, 0)
            })
        
        # Incluir tipos sin horas registradas
        for tipo, meta in metas_map.items():
            if not any(p['tipo_actividad'] == tipo for p in progreso) and meta > 0:
                progreso.append({
                    'tipo_actividad': tipo,
                    'horas_objetivo': meta,
                    'horas_alcanzadas': 0,
                    'porcentaje': 0,
                    'horas_restantes': meta
                })
        
        serializer = ProgresoMetaSerializer(progreso, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def historial(self, request):
        user = request.user
        registros = RegistroHoras.objects.filter(becario=user).select_related('actividad')
        
        from records.serializers import RegistroHorasSerializer
        serializer = RegistroHorasSerializer(registros, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def progreso_general(self, request):
        if request.user.rol != 'administrador':
            return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        
        # Estadísticas generales
        total_becarios = Usuario.objects.filter(rol='becario').count()
        total_horas_aprobadas = RegistroHoras.objects.filter(
            estado_aprobacion='A'
        ).aggregate(total=Sum('horas_reportadas'))['total'] or 0
        
        # Progreso individual por becario
        becarios_progreso = []
        for becario in Usuario.objects.filter(rol='becario'):
            horas_becario = RegistroHoras.objects.filter(
                becario=becario, estado_aprobacion='A'
            ).aggregate(total=Sum('horas_reportadas'))['total'] or 0
            
            meta_total = (
                becario.meta_horas_voluntariado_interno +
                becario.meta_horas_voluntariado_externo +
                becario.meta_horas_chat_ingles +
                becario.meta_horas_talleres
            )
            
            porcentaje = (horas_becario / meta_total * 100) if meta_total > 0 else 0
            
            becarios_progreso.append({
                'becario': becario,
                'horas_totales_aprobadas': horas_becario,
                'meta_total': meta_total,
                'porcentaje_cumplimiento': round(porcentaje, 2)
            })
        
        serializer = ProgresoGeneralSerializer(becarios_progreso, many=True)
        
        return Response({
            'estadisticas_generales': {
                'total_becarios': total_becarios,
                'total_horas_aprobadas': float(total_horas_aprobadas),
            },
            'progreso_becarios': serializer.data
        })