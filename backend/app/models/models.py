from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum as SqlEnum,
    Float,
    ForeignKey,
    Integer,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class TipoIncidencia(str, Enum):
    INUNDACION = "inundacion"
    ARBOL_CAIDO = "arbol"
    VIA_BLOQUEADA = "bloqueo"


class NivelAlerta(str, Enum):
    VERDE = "VERDE"
    AMARILLA = "AMARILLA"
    ROJA = "ROJA"


class Provincia(Base):
    __tablename__ = "provincias"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    codigo_postal: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    alerta_actual: Mapped[str] = mapped_column(
        SqlEnum(NivelAlerta, native_enum=False), default=NivelAlerta.VERDE
    )

    reportes: Mapped[list["Reporte"]] = relationship(back_populates="provincia")


class Reporte(Base):
    __tablename__ = "reportes"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    tipo: Mapped[str] = mapped_column(
        SqlEnum(TipoIncidencia, native_enum=False), nullable=False
    )
    lugar: Mapped[Optional[str]] = mapped_column(String(300), nullable=True)
    descripcion: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    latitud: Mapped[float] = mapped_column(Float, nullable=False)
    longitud: Mapped[float] = mapped_column(Float, nullable=False)
    foto_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    provincia_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("provincias.id"), nullable=False
    )
    votos_activo: Mapped[int] = mapped_column(Integer, default=1)
    votos_resuelto: Mapped[int] = mapped_column(Integer, default=0)
    activo: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    creado_en: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), index=True
    )

    provincia: Mapped["Provincia"] = relationship(back_populates="reportes")


PROVINCIAS_RD: list[tuple[str, NivelAlerta]] = [
    ("Distrito Nacional", NivelAlerta.AMARILLA),
    ("Santo Domingo", NivelAlerta.AMARILLA),
    ("Santiago", NivelAlerta.VERDE),
    ("Azua", NivelAlerta.ROJA),
    ("Baoruco", NivelAlerta.ROJA),
    ("Barahona", NivelAlerta.ROJA),
    ("Dajabón", NivelAlerta.AMARILLA),
    ("Duarte", NivelAlerta.VERDE),
    ("Elías Piña", NivelAlerta.ROJA),
    ("El Seibo", NivelAlerta.VERDE),
    ("Espaillat", NivelAlerta.VERDE),
    ("Independencia", NivelAlerta.ROJA),
    ("La Altagracia", NivelAlerta.VERDE),
    ("La Romana", NivelAlerta.VERDE),
    ("La Vega", NivelAlerta.VERDE),
    ("María Trinidad Sánchez", NivelAlerta.VERDE),
    ("Monte Cristi", NivelAlerta.VERDE),
    ("Pedernales", NivelAlerta.ROJA),
    ("Peravia", NivelAlerta.AMARILLA),
    ("Puerto Plata", NivelAlerta.VERDE),
    ("Hermanas Mirabal", NivelAlerta.VERDE),
    ("Samaná", NivelAlerta.VERDE),
    ("San Cristóbal", NivelAlerta.AMARILLA),
    ("San Juan", NivelAlerta.ROJA),
    ("San Pedro de Macorís", NivelAlerta.VERDE),
    ("Sánchez Ramírez", NivelAlerta.AMARILLA),
    ("Santiago Rodríguez", NivelAlerta.VERDE),
    ("Valverde", NivelAlerta.VERDE),
    ("Monseñor Nouel", NivelAlerta.AMARILLA),
    ("Monte Plata", NivelAlerta.VERDE),
    ("Hato Mayor", NivelAlerta.VERDE),
    ("San José de Ocoa", NivelAlerta.AMARILLA),
]


def seed_provincias(db) -> None:
    if db.query(Provincia).count() > 0:
        return
    db.add_all(Provincia(nombre=nombre, alerta_actual=alerta) for nombre, alerta in PROVINCIAS_RD)
    db.commit()